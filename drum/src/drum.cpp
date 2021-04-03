#include <Application.h>
#include <spdlog/spdlog.h>

int main() {
    spdlog::set_level(spdlog::level::info);
    Application app(1300, 800);
    return app.getErrorCode();
}
