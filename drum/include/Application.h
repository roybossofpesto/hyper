#pragma once

#include <glad/glad.h>

#include <cstdint>

struct GLFWwindow;

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

    ErrorCode error_code_;
    GLFWwindow* window_ = nullptr;
    bool running_ = true;
    Size width_window_ = 0;
    Size height_window_ = 0;
    Size width_framebuffer_ = 0;
    Size height_framebuffer_ = 0;

    GLuint vao_ = 0;
};
