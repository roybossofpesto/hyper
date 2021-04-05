#include <Application.h>

// clang-format off
#include <glad/glad.h>
#include <GLFW/glfw3.h>
// clang-format on

#include <spdlog/spdlog.h>

#include <glm/glm.hpp>
#include <glm/gtc/type_ptr.hpp>

#include <imgui.h>
#include <backends/imgui_impl_glfw.h>
#include <backends/imgui_impl_opengl3.h>
#include <fonts/fontawesome5.h>
#include <IconsFontAwesome5.h>
#include <FindSolution.h>

#include <cassert>
#include <chrono>

constexpr float ui_font_base_size = 17;
constexpr float ui_window_spacing = 5;
constexpr float ui_main_menu_height = 24;
constexpr float ui_window_width = 330;

namespace ImGui {
    bool BitButton(int* value_raw, const int kk, const bool is_read_only, const ImVec2 button_size);
    bool BitFlippers(const char* label, int* value_raw, const int pattern_length, const ImVec2 button_size = {30, 30});
    void BitDisplay(const int value_raw, const int pattern_length, const ImVec2 button_size = {30, 30});
}

bool ImGui::BitButton(int* value_raw, const int kk, const bool is_read_only, const ImVec2 button_size) {
    assert(value_raw);
    unsigned int value = static_cast<unsigned int>(*value_raw);

    const unsigned int mask = 1 << kk;
    const bool is_bit_on = (value & mask) != 0;
    const std::string label = fmt::format("{0:x}", kk);

    static const std::array<ImVec4, 4> off_colors ={
        ImVec4{0., 0., 0., 1.},
        ImVec4{.05, .05, .05, 1.},
        ImVec4{.1, .1, .1, 1.},
        ImVec4{1., 1., 1., 1.},
    };

    static const std::array<ImVec4, 4> on_colors ={
        ImVec4{1., 1., 1., 1.},
        ImVec4{.95, .95, .95, 1.},
        ImVec4{.9, .9, .9, 1.},
        ImVec4{0., 0., 0., 1.},
    };

    const auto& colors = is_bit_on ? on_colors : off_colors;

    ImGui::PushID(kk);
    ImGui::PushStyleColor(ImGuiCol_Button, std::get<0>(colors));
    ImGui::PushStyleColor(ImGuiCol_ButtonHovered, std::get<1>(colors));
    ImGui::PushStyleColor(ImGuiCol_ButtonActive, std::get<2>(colors));
    ImGui::PushStyleColor(ImGuiCol_Text, std::get<3>(colors));
    const bool updated = ImGui::Button(label.c_str(), button_size);
    ImGui::PopStyleColor(4);
    ImGui::PopID();

    if (is_read_only) return false;

    if (updated) value ^= mask;
    *value_raw = static_cast<int>(value);

    return updated;
}

bool ImGui::BitFlippers(const char* label, int* value_raw, const int pattern_length, const ImVec2 button_size)
{
    assert(label);
    ImGui::PushID(label);
    bool any = false;
    for (int kk=0; kk<pattern_length; kk++) {
        if (kk) ImGui::SameLine();
        const int kk_ = pattern_length - 1 - kk;
        any |= ImGui::BitButton(value_raw, kk_, false, button_size);
    }
    ImGui::PopID();
    return any;
}

void ImGui::BitDisplay(const int value, const int pattern_length, const ImVec2 button_size)
{
    int value_raw = value;
    for (int kk=0; kk<pattern_length; kk++) {
        if (kk) ImGui::SameLine();
        const int kk_ = pattern_length - 1 - kk;
        ImGui::BitButton(&value_raw, kk_, true, button_size);
    }
}

Application::Application(const Size width_window, const Size height_window) {
    using Clock = std::chrono::high_resolution_clock;
    using Top = Clock::time_point;
    using Duration = std::chrono::duration<float>;

    if (!initialize(width_window, height_window))
      return;

    spdlog::info("entering main loop");

    Top last_top = Clock::now();
    while (running_) {
      glViewport(0, 0, width_framebuffer_, height_framebuffer_);

      const Top top = Clock::now();
      const Duration delta = top - last_top;
      const float dt = std::min(50e-3f, delta.count());

      startFrame();

      ImGui::NewFrame();
      runImGui();
      ImGui::Render();

      runScene(dt);

      endFrame();

      last_top = top;
    }

    destroy();
}

Application::ErrorCode Application::getErrorCode() const {
    return error_code_;
}

bool Application::initialize(const Size width, const Size height) {
    { // create window
        if (!glfwInit()) {
            spdlog::error("Failed init GLFW");
            error_code_ = 1;
            return false;
        }

        glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 1);
        glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
        glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
        window_ = glfwCreateWindow(width, height, "drum machine", nullptr, nullptr);
        if (!window_) {
            spdlog::error("Failed to create the GLFW window.");
            error_code_ = 1;
            running_ = false;
            return false;
        }

        width_window_ = width;
        height_window_ = height;
        glfwGetFramebufferSize(window_, &width_framebuffer_, &height_framebuffer_);

        const GLFWvidmode* vid_mode = glfwGetVideoMode(glfwGetPrimaryMonitor());
        glfwSetWindowPos(window_, (vid_mode->width - width) / 2, (vid_mode->height - height) / 2);
        glfwMakeContextCurrent(window_);
        spdlog::info("created context");
        if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) {
            spdlog::error("Failed to load OpenGL functions.");
            error_code_ = 1;
            running_ = false;
            return false;
        }

        glfwSetWindowUserPointer(window_, this);

        glfwSwapInterval(true);
        spdlog::info("OpenGL version: {}", glGetString(GL_VERSION));
        spdlog::info("Device: {}", glGetString(GL_RENDERER));

        if (!checkOpenGLError()) return false;
    }

    { // register callbacks
        spdlog::info("register glfw callbacks");

        glfwSetErrorCallback(
            [](int error, const char* msg) {
            spdlog::error("GLFW Error {}: {}", error, msg);
        });

        glfwSetMouseButtonCallback(window_, [](GLFWwindow* window, int32_t button, int32_t action, int32_t) {
            auto& io = ImGui::GetIO();

            if (io.WantCaptureMouse) return;

            auto self = static_cast<Application*>(glfwGetWindowUserPointer(window));
            assert(self);

            double position_x = 0.0;
            double position_y = 0.0;
            glfwGetCursorPos(window, &position_x, &position_y);
            self->last_mouse_position_ = glm::vec2(position_x, position_y);

            auto fill_button = [&](MouseButton button) {
                if (action == GLFW_PRESS) self->mouse_pressed_ |= static_cast<MouseButtons>(button);
                if (action == GLFW_RELEASE) self->mouse_pressed_ &= ~static_cast<MouseButtons>(button);
            };

            switch (button) {
                case GLFW_MOUSE_BUTTON_LEFT:
                    fill_button(MouseButton::LeftButon);
                    break;
                case GLFW_MOUSE_BUTTON_MIDDLE:
                    fill_button(MouseButton::MiddleButton);
                    break;
                case GLFW_MOUSE_BUTTON_RIGHT:
                    fill_button(MouseButton::RightButton);
                    break;
            }
        });

        glfwSetCursorPosCallback(window_, [](GLFWwindow* window, double xx, double yy) {
            auto self = static_cast<Application*>(glfwGetWindowUserPointer(window));
            assert(self);

            glm::vec2& last_mouse_position = self->last_mouse_position_;
            const glm::vec2 current_mouse_position {xx, yy};
            // auto& quaternion = self->data.camera.quaternion_target;

            if (self->mouse_pressed_ & static_cast<MouseButtons>(MouseButton::LeftButon)) {
                const glm::vec2 delta = current_mouse_position - last_mouse_position;
                spdlog::trace("delta {},{}", delta.x, delta.y);

                /*const glm::quat dqx = glm::angleAxis(delta.x * 1e-2f, glm::vec3(0, 1, 0));
                const glm::quat dqy = glm::angleAxis(delta.y * 1e-2f, glm::vec3(1, 0, 0));
                spdlog::trace("dqx {},{},{},{}", dqx.x, dqx.y, dqx.z, dqx.w);
                spdlog::trace("dqy {},{},{},{}", dqy.x, dqy.y, dqy.z, dqy.w);

                quaternion = dqx * dqy * quaternion;
                spdlog::trace("quaternion_target {},{},{},{}",
                        quaternion.x,
                        quaternion.y,
                        quaternion.z,
                        quaternion.w);*/

                last_mouse_position = current_mouse_position;
            }
        });

        /*glfwSetScrollCallback(
                window_, [](GLFWwindow* window, double, double y_offset) {
                if (ImGui::GetIO().WantCaptureMouse)
                return;

                Application::pImpl* pImpl_ =
                static_cast<Application::pImpl*>(glfwGetWindowUserPointer(window));
                assert(pImpl_);
                constexpr float sensibility = 0.2f;
                pImpl_->data.camera.distance_to_origin -=
                sensibility*static_cast<float>(y_offset);
                pImpl_->data.camera.distance_to_origin =
                std::clamp(pImpl_->data.camera.distance_to_origin, 1.8f, 12.f);
            });*/

        glfwSetWindowSizeCallback(window_, [](GLFWwindow* window, int width, int height) {
            spdlog::critical("resize {} {}", width, height);
            auto self = static_cast<Application*>(glfwGetWindowUserPointer(window));
            assert(self);

            self->width_window_ = width;
            self->height_window_ = height;
            glfwGetFramebufferSize(self->window_, &self->width_framebuffer_, &self->height_framebuffer_);
        });
    }


    { // init imgui
        spdlog::info("init imgui");

        IMGUI_CHECKVERSION();
        ImGui::CreateContext();

        ImGui_ImplGlfw_InitForOpenGL(window_, true);
        ImGui_ImplOpenGL3_Init("#version 410 core");

        ImGui::Spectrum::StyleColorsSpectrum();
        ImVec4* colors = ImGui::GetStyle().Colors;
        colors[ImGuiCol_Tab] = ImGui::ColorConvertU32ToFloat4(ImGui::Spectrum::GRAY300);
        colors[ImGuiCol_TabHovered] = ImGui::ColorConvertU32ToFloat4(ImGui::Spectrum::GRAY500);
        colors[ImGuiCol_TabActive] = ImGui::ColorConvertU32ToFloat4(ImGui::Spectrum::GRAY400);

        auto& io = ImGui::GetIO();

        io.Fonts->Clear();

        ImGui::Spectrum::LoadFont(ui_font_base_size);

        static const ImWchar icons_ranges[] = {ICON_MIN_FA, ICON_MAX_FA, 0};
        ImFontConfig icons_config;
        icons_config.MergeMode = true;
        icons_config.PixelSnapH = true;

        auto font_awesome = io.Fonts->AddFontFromMemoryCompressedTTF(
            fontawesome5_compressed_data,
            fontawesome5_compressed_size,
            ui_font_base_size,
            &icons_config,
            icons_ranges);

        io.Fonts->Build();

        if (font_awesome == nullptr) {
            spdlog::error("Failed to load font awesome.");
            error_code_ = 1;
            running_ = false;
            return false;
        }

        io.ConfigWindowsMoveFromTitleBarOnly = true;
        io.ConfigWindowsResizeFromEdges = true;

        if (!checkOpenGLError()) return false;
    }

  { // init opengl
        spdlog::info("init opengl");

        glGenVertexArrays(1, &vao_);
        glBindVertexArray(vao_);

        // glEnable(GL_TEXTURE_CUBE_MAP_SEAMLESS);

        // axis_.Initialize();

        /*const auto resources_directory = auxiliary::GetResourcesDirectory();
        spdlog::info("resources_directory \"{}\"", resources_directory.string());
        spdlog::info("resources {}", std::filesystem::is_directory(resources_directory) ? "OK" : "ERR");

        program_draw_bounding_box_ = OpenGL_RAII::make_program_from_sources(kVertexBoundingBoxSource, kFragmentBoundingBoxSource);

        if (!program_draw_bounding_box_ || !program_draw_bounding_box_->IsExecutable()) {
            spdlog::error("Failed to create bounding box program.");
            error_code_ = 1;
            running_ = false;
            return false;
        }

        {
            glGenBuffers(1, &vbo_cube_);
            glBindBuffer(GL_ARRAY_BUFFER, vbo_cube_);
            glBufferData(
                GL_ARRAY_BUFFER, sizeof(kGeometryCube), nullptr, GL_STATIC_DRAW);
                void* ptr = glMapBuffer(GL_ARRAY_BUFFER, GL_WRITE_ONLY);
                memcpy(ptr, kGeometryCube, sizeof(kGeometryCube));
                glUnmapBuffer(GL_ARRAY_BUFFER);
                glBindBuffer(GL_ARRAY_BUFFER, 0);
        }

        {
            glGenBuffers(1, &vbo_bounding_box_);
            glBindBuffer(GL_ARRAY_BUFFER, vbo_bounding_box_);
            glBufferData(
                GL_ARRAY_BUFFER, sizeof(kGeometryBoundingBox), nullptr, GL_STATIC_DRAW);
                void* ptr = glMapBuffer(GL_ARRAY_BUFFER, GL_WRITE_ONLY);
                memcpy(ptr, kGeometryBoundingBox, sizeof(kGeometryBoundingBox));
                glUnmapBuffer(GL_ARRAY_BUFFER);
                glBindBuffer(GL_ARRAY_BUFFER, 0);
        }*/

        if (!checkOpenGLError()) return false;
    }


    return true;
}

bool Application::checkOpenGLError() {
    error_code_ = glGetError();
    if (error_code_) {
        spdlog::error("OpenGL error: {}", std::to_string(error_code_));
        running_ = false;
    }
    return error_code_ == 0;
}


void Application::startFrame() {
    glfwPollEvents();

    if (glfwWindowShouldClose(window_)) {
        running_ = false;
    }

    ImGui_ImplOpenGL3_NewFrame();
    ImGui_ImplGlfw_NewFrame();
}

void Application::endFrame() {
    checkOpenGLError();
    ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
    glfwSwapBuffers(window_);
}

void Application::destroy() {
  glDeleteVertexArrays(1, &vao_);
  // glDeleteBuffers(1, &vbo_cube_);

  ImGui::DestroyContext();
  glfwTerminate();
}

void Application::runImGui() {
    if (ImGui::BeginMainMenuBar()) {
        /*if (ImGui::BeginMenu("File")) {
            ImGui::MenuItemWithShortcut("Save..", GLFW_KEY_S, ImGuiKeyModFlags_Ctrl);
            ImGui::MenuItemWithShortcut("Open..", GLFW_KEY_O, ImGuiKeyModFlags_Ctrl);
            ImGui::EndMenu();
        }

        if (ImGui::BeginMenu("Shader")) {
            ImGui::MenuItemWithShortcut("Update", GLFW_KEY_F5);
            ImGui::MenuItemWithShortcut("Reset", GLFW_KEY_F6);
            ImGui::EndMenu();
        }

        if (ImGui::PresetsMenu(text_editor))
            triggers.should_parse = true;
        */

        if (ImGui::BeginMenu("Panels")) {
            ImGui::MenuItem("Options", nullptr, &data.display_options);
            ImGui::MenuItem("Patterns", nullptr, &data.display_patterns);
            ImGui::MenuItem("Demo", nullptr, &data.display_demo);
            // ImGui::Separator();
            // ImGui::MenuItemWithShortcut("Toggle options", GLFW_KEY_F2);
            // ImGui::MenuItemWithShortcut("Toggle specific panels", GLFW_KEY_F3);
            // ImGui::MenuItemWithShortcut("Toggle canvas", GLFW_KEY_F4);
            ImGui::EndMenu();
        }

        ImGui::EndMainMenuBar();
    }

    const float top_offset = ui_window_spacing + ui_main_menu_height;

    if (data.display_options) {
        const auto cond = ImGuiCond_Appearing;
        ImGui::SetNextWindowPos(ImVec2(ui_window_spacing, top_offset + ui_window_spacing), cond);
        ImGui::SetNextWindowSize(ImVec2(ui_window_width, -1), cond);
        ImGui::Begin("options", &data.display_options, 0);

        {
            static const std::vector<const char*> names {
                "trace",
                "debug",
                "info",
                "warning",
                "critical",
                "off",
            };
            auto log_level = static_cast<int>(spdlog::get("")->level());
            assert(log_level < static_cast<int>(names.size()));
            ImGui::Combo("log level", &log_level, names.data(), static_cast<int>(names.size()));
            spdlog::set_level(static_cast<spdlog::level::level_enum>(log_level));
        }

        ImGui::ColorEdit3("clear color", glm::value_ptr(data.background_color));

        ImGui::End();
    }

    if (data.display_patterns) {
        auto& state = data.find_solution_state;
        const auto state_init = state;

        const auto cond = ImGuiCond_Appearing;
        ImGui::SetNextWindowPos(ImVec2(ui_window_spacing + ui_window_width + ui_window_spacing, top_offset + ui_window_spacing), cond);
        ImGui::SetNextWindowSize(ImVec2(-1, -1), ImGuiCond_Always);
        ImGui::Begin("patterns", &data.display_patterns, 0);

        ImGui::SliderInt("pattern", &state.pattern_length, 2, 8);
        state.pattern_length = std::max(state.pattern_length, 1);
        state.pattern_length = std::min(state.pattern_length, 16);

        ImGui::Separator();

        ImGui::PushID("input");
        if (ImGui::Button("rand")) {
            std::uniform_int_distribution<int> dist(0, 1 << state.pattern_length - 1);
            state.input_value = dist(data.rng);
        }
        ImGui::SameLine();
        ImGui::InputInt("input", &state.input_value);
        state.input_value %= 1 << state.pattern_length;
        ImGui::PopID();

        ImGui::PushID("output");
        if (ImGui::Button("rand")) {
            std::uniform_int_distribution<int> dist(0, 1 << state.pattern_length - 1);
            state.output_value = dist(data.rng);
        }
        ImGui::SameLine();
        ImGui::InputInt("output", &state.output_value);
        state.output_value %= 1 << state.pattern_length;
        ImGui::PopID();


        ImGui::BitFlippers("#input_value", &state.input_value, state.pattern_length);
        ImGui::BitFlippers("#output_value", &state.output_value, state.pattern_length);

        if (state != state_init) data.find_solution_data = find_solution(state);

        ImGui::Separator();

        const std::string solution_status =
            data.find_solution_data.solution.empty() ? "no solution" :
            fmt::format("{} steps solution", data.find_solution_data.solution.size());
        ImGui::Text(solution_status.c_str());

        for (const auto& step : data.find_solution_data.solution)
            ImGui::BitDisplay(step, state.pattern_length);

        ImGui::End();
    }

    if (data.display_demo)
        ImGui::ShowDemoWindow(&data.display_demo);
}

void Application::runScene(const float& dt) {
    if (height_window_==0) // Happen when the window is minimized
        return;

    const auto aspect_ratio = static_cast<float>(width_window_) / height_window_;

    glBindVertexArray(vao_);
    glClearColor(
        data.background_color[0],
        data.background_color[1],
        data.background_color[2], 1.f);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    checkOpenGLError();
}
