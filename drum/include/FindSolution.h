#pragma once

#include <Action.h>

#include <vector>

struct FindSolution {
    struct State {
        int pattern_length = 8;
        int input_value = 0b10110111;
        int output_value = 0b00101001;
        int rng_seed = 42;
        bool operator!=(const State& other) const;
    };

    struct Data {
        std::vector<int> solution;
    };

    static Data run(const State& state);
};

using FindSolutionAction = async::Action<FindSolution>;
