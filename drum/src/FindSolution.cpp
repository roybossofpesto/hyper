#include "FindSolution.h"

#include <spdlog/spdlog.h>

bool FindSolutionState::operator!=(const FindSolutionState& other) const {
    if (input_value != other.input_value) return true;
    if (output_value != other.output_value) return true;
    if (pattern_length != other.pattern_length) return true;
    return false;
}

FindSolutionData find_solution(const FindSolutionState& state) {
    spdlog::critical("find {1:0{0}b} -> {2:0{0}b}", state.pattern_length, state.input_value, state.output_value);
    FindSolutionData data;
    data.number_of_solutions = 3;
    return data;
}
