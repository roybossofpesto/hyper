if(TARGET soloud::soloud)
    return()
endif()

find_package(SDL2 REQUIRED)
message(STATUS "SDL2 ${SDL2_FOUND} ${SDL2_INCLUDE_DIRS} ${SDL2_LIBRARIES}")
message(STATUS "soloud::soloud")

include(FetchContent)
FetchContent_Declare(
    soloud
    GIT_REPOSITORY https://github.com/jarikomppa/soloud.git
    GIT_TAG RELEASE_20200207
)
FetchContent_MakeAvailable(soloud)

add_library(soloud)
add_library(soloud::soloud ALIAS soloud)

file(GLOB_RECURSE soloud_BACKEND "${soloud_SOURCE_DIR}/src/backend/sdl2_static/**.c*")
file(GLOB_RECURSE soloud_CORE "${soloud_SOURCE_DIR}/src/core/**.c*")
message(STATUS "${soloud_BACKEND} ${soloud_CORE}")

target_sources(soloud
    PRIVATE
    ${soloud_BACKEND}
    ${soloud_CORE}
    #"${soloud_SOURCE_DIR}/src/nfd_common.h"
    #"${soloud_SOURCE_DIR}/src/nfd_common.c"
)

target_include_directories(soloud
    PUBLIC
    "${soloud_SOURCE_DIR}/include"
    "${SDL2_INCLUDE_DIRS}"
)

target_compile_definitions(soloud
    PUBLIC
    WITH_SDL2_STATIC
)

target_link_libraries(soloud
    PUBLIC
    "${SDL2_LIBRARIES}"
)

#if(WIN32)
#    target_sources(soloud PRIVATE "${soloud}/src/nfd_win.cpp")
#elseif(APPLE)
#    target_sources(soloud PRIVATE "${soloud_SOURCE_DIR}/src/nfd_cocoa.m")
#elseif(UNIX)
#    target_sources(soloud PRIVATE "${soloud_SOURCE_DIR}/src/nfd_gtk.c")
#
#    # Use the package PkgConfig to detect GTK+ headers/library files
#    find_package(PkgConfig REQUIRED)
#    pkg_check_modules(GTK3 REQUIRED IMPORTED_TARGET gtk+-3.0)
#endif()
#
#target_include_directories(soloud PRIVATE "${soloud_SOURCE_DIR}/src/")

#set_target_properties(soloud PROPERTIES FOLDER third_party)

## Warning config
#if("${CMAKE_CXX_COMPILER_ID}" STREQUAL "GNU")
#    target_compile_options(soloud PRIVATE
#        "-Wno-format-truncation"
#    )
#endif()

