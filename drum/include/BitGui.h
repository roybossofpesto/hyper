#pragma once

#include <imgui.h>

namespace ImGui {
    bool BitButton(int* value_raw, const int kk, const bool is_read_only, const ImVec2 button_size);
    bool BitFlippers(const char* label, int* value_raw, const int pattern_length, const ImVec2 button_size = {30, 30});
    void BitDisplay(const int value_raw, const int pattern_length, const ImVec2 button_size = {30, 30});
}
