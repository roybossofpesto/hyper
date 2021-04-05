#include <BitGui.h>

#include <spdlog/spdlog.h>

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
