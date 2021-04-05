#pragma once

#include <vector>

struct FindSolutionState {
    int pattern_length = 8;
    int input_value = 0b10110111;
    int output_value = 0b00101001;
    bool operator!=(const FindSolutionState& other) const;
};

struct FindSolutionData {
    std::vector<int> solution;
};

FindSolutionData find_solution(const FindSolutionState& state);
