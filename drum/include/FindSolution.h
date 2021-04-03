#pragma once

struct FindSolutionState {
    int input_value = 0b10110111;
    int output_value = 0b00101001;
    int pattern_length = 4;
    bool operator!=(const FindSolutionState& other) const;
};

struct FindSolutionData {
    int number_of_solutions;
};

FindSolutionData find_solution(const FindSolutionState& state);
