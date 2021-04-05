cmake_minimum_required (VERSION 3.16)
project(dum LANGUAGES CXX C)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
list(APPEND CMAKE_MODULE_PATH ${PROJECT_SOURCE_DIR}/cmake)

option(IMGUI_USE_DARK_THEME "Use Dark ImGui Spectrum Theme" ON)

include(FetchContent)

macro(fetch_content lib_name git_repository git_tag)
  FetchContent_Declare(
    ${lib_name}
    GIT_REPOSITORY ${git_repository}
    GIT_TAG        ${git_tag}
  )
  FetchContent_MakeAvailable(${lib_name})
endmacro()

option(GLFW_BUILD_DOCS OFF)
option(GLFW_BUILD_EXAMPLES OFF)
option(GLFW_BUILD_TESTS OFF)
#fetch_content(catch2 https://github.com/catchorg/Catch2.git v2.13.3)
fetch_content(glfw https://github.com/glfw/glfw.git 3.3.3)
fetch_content(glm https://github.com/g-truc/glm.git 0.9.9.8)
fetch_content(glad https://github.com/Dav1dde/glad.git v0.1.34)
fetch_content(imgui
    https://github.com/adobe/imgui.git
    bc8297b793928b96d5db678a5b4f1229c3f493f5)
#fetch_content(imguicolortextedit
#    https://github.com/BalazsJako/ImGuiColorTextEdit.git
#    0a88824f7de8d0bd11d8419066caa7d3469395c4)
#fetch_content(imguinodeeditor
#    https://github.com/thedmd/imgui-node-editor.git
#    687a72f940c76cf5064e13fe55fa0408c18fcbe4)
fetch_content(imgui_fonts
    https://github.com/HasKha/imgui-fonts.git
    4b785f4871b651d1d35be6286726d74c5804f04e)
fetch_content(spdlog https://github.com/gabime/spdlog.git v1.6.1)

add_library(imgui
    "${imgui_SOURCE_DIR}/imgui.h"
    "${imgui_SOURCE_DIR}/imgui_internal.h"
    "${imgui_SOURCE_DIR}/imgui.cpp"
    "${imgui_SOURCE_DIR}/imgui_demo.cpp"
    "${imgui_SOURCE_DIR}/imgui_draw.cpp"
    "${imgui_SOURCE_DIR}/imgui_widgets.cpp"
    "${imgui_SOURCE_DIR}/imgui_tables.cpp"
    "${imgui_SOURCE_DIR}/imgui_spectrum.h"
    "${imgui_SOURCE_DIR}/imgui_spectrum.cpp"
    "${imgui_SOURCE_DIR}/backends/imgui_impl_opengl3.h"
    "${imgui_SOURCE_DIR}/backends/imgui_impl_opengl3.cpp"
    "${imgui_SOURCE_DIR}/backends/imgui_impl_glfw.h"
    "${imgui_SOURCE_DIR}/backends/imgui_impl_glfw.cpp"
    "${imgui_SOURCE_DIR}/misc/cpp/imgui_stdlib.h"
    "${imgui_SOURCE_DIR}/misc/cpp/imgui_stdlib.cpp"
    #"${imguicolortextedit_SOURCE_DIR}/TextEditor.h"
    #"${imguicolortextedit_SOURCE_DIR}/TextEditor.cpp"
    #"${imguinodeeditor_SOURCE_DIR}/imgui_node_editor.h"
    #"${imguinodeeditor_SOURCE_DIR}/imgui_node_editor.cpp"
    #"${imguinodeeditor_SOURCE_DIR}/imgui_node_editor_api.cpp"
    #"${imguinodeeditor_SOURCE_DIR}/imgui_canvas.h"
    #"${imguinodeeditor_SOURCE_DIR}/imgui_canvas.cpp"
    #"${imguinodeeditor_SOURCE_DIR}/crude_json.h"
    #"${imguinodeeditor_SOURCE_DIR}/crude_json.cpp"
)
add_library(imgui::imgui ALIAS imgui)
target_compile_definitions(imgui PUBLIC
    IMGUI_IMPL_OPENGL_LOADER_GLAD=1)
target_include_directories(imgui PUBLIC
    "${imgui_SOURCE_DIR}"
    "${imgui_SOURCE_DIR}/examples"
    "${imguicolortextedit_SOURCE_DIR}"
    "${imguinodeeditor_SOURCE_DIR}"
)
target_link_libraries(imgui PUBLIC glfw glad imgui::fonts)
if(IMGUI_USE_DARK_THEME)
    target_compile_definitions(imgui PUBLIC SPECTRUM_USE_DARK_THEME)
endif()

add_executable(drum)
target_sources(drum
    PRIVATE
    "src/drum.cpp"
    "src/BitGui.cpp"
    "src/FindSolution.cpp"
    "src/Application.cpp"
    PUBLIC
    "include/HashedItem.h"
    "include/Action.h"
    "include/BitGui.h"
    "include/FindSolution.h"
    "include/Application.h"
)
target_include_directories(drum
    PUBLIC
    "include"
)
target_link_libraries(drum
    PRIVATE
    spdlog
    imgui
    glfw
    PUBLIC
    glm
)

#include(nativefiledialog)
#include(nlohmann_json)
#include(clhpp)
#include(stb)
#include(cli11)
#
#enable_testing()
#add_subdirectory(grammar)
#add_subdirectory(opengl_raii)
#add_subdirectory(auxiliary)
#add_subdirectory(reconstruction)
#add_subdirectory(app)
#
