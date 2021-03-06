#pragma once

#include <soloud.h>
#include <soloud_wav.h>

#include <FindSolution.h>

#include <glad/glad.h>
#include <glm/glm.hpp>

#include <cstdint>
#include <random>

struct GLFWwindow;

struct Data {
    bool display_options = true;
    bool display_patterns = true;
    bool display_demo = false;
    glm::vec3 background_color {1, 0, 0};
    std::mt19937_64 rng {42};
    FindSolution::State find_solution_state;
};

class Application {
public:
    using Size = int32_t;
    using ErrorCode = int32_t;

    Application(const Size width, const Size height);
    ErrorCode getErrorCode() const;

protected:
    bool initialize(const Size width, const Size height);
    bool checkOpenGLError();

    void startFrame();
    void endFrame();
    void destroy();
    void runImGui();
    void runScene(const float& dt);

    ErrorCode error_code_;
    GLFWwindow* window_ = nullptr;
    bool running_ = true;
    Size width_window_ = 0;
    Size height_window_ = 0;
    Size width_framebuffer_ = 0;
    Size height_framebuffer_ = 0;

    enum struct MouseButton {
      NoButton = 0,
      LeftButon = 1,
      MiddleButton = 2,
      RightButton = 4
    };
    using MouseButtons = uint8_t;
    MouseButtons mouse_pressed_ = static_cast<MouseButtons>(MouseButton::NoButton);
    glm::vec2 last_mouse_position_ = glm::vec2(0.0, 0.0);

    GLuint vao_ = 0;

    Data data;
    FindSolutionAction find_solution_action;
    SoLoud::Soloud soloud;
    SoLoud::Wav sample_hihat;
};
