#include <Application.h>

// clang-format off
#include <glad/glad.h>
#include <GLFW/glfw3.h>
// clang-format on

#include <spdlog/spdlog.h>

#include <imgui.h>
#include <backends/imgui_impl_glfw.h>
#include <backends/imgui_impl_opengl3.h>
#include <fonts/fontawesome5.h>
#include <IconsFontAwesome5.h>

#include <cassert>
#include <chrono>

constexpr float ui_font_base_size = 17;

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
        window_ = glfwCreateWindow(width, height, "Morpheus", nullptr, nullptr);
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

        /*glfwSetCursorPosCallback(window_, [](GLFWwindow* window, double x, double y) {
                Application::pImpl* pImpl_ =
                static_cast<Application::pImpl*>(glfwGetWindowUserPointer(window));
                assert(pImpl_);

                auto& last_mouse_position = pImpl_->last_mouse_position_;
                auto& quaternion = pImpl_->data.camera.quaternion_target;

                if (pImpl_->mouse_pressed_ & static_cast<MouseButtons>(MouseButton::LeftButon)) {
                const glm::vec2 delta = glm::vec2(x - last_mouse_position.x, y - last_mouse_position.y);
                spdlog::trace("delta {},{}", delta.x, delta.y);

                const glm::quat dqx = glm::angleAxis(delta.x * 1e-2f, glm::vec3(0, 1, 0));
                const glm::quat dqy = glm::angleAxis(delta.y * 1e-2f, glm::vec3(1, 0, 0));
                spdlog::trace("dqx {},{},{},{}", dqx.x, dqx.y, dqx.z, dqx.w);
                spdlog::trace("dqy {},{},{},{}", dqy.x, dqy.y, dqy.z, dqy.w);

                quaternion = dqx * dqy * quaternion;
                spdlog::trace("quaternion_target {},{},{},{}",
                        quaternion.x,
                        quaternion.y,
                        quaternion.z,
                        quaternion.w);

                last_mouse_position = glm::vec2(x, y);
                }
        });

        glfwSetScrollCallback(
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
    ImGui::Begin("Hello");
    float value = .5;
    ImGui::SliderFloat("coucou", &value, 0, 1);
    ImGui::End();
}

void Application::runScene(const float& dt) {
    if (height_window_==0) // Happen when the window is minimized
        return;

    const auto aspect_ratio = static_cast<float>(width_window_) / height_window_;

    const glm::vec3 background_color {1, 0, 0};

    glBindVertexArray(vao_);
    glClearColor(
        background_color[0],
        background_color[1],
        background_color[2], 1.f);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    checkOpenGLError();
}