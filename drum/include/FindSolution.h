#pragma once

#include <ContainerHasher.h>
#include <HashedItem.h>
#include <Action.h>

#include <unordered_map>
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
        using Path = std::vector<int>;
        using HashedPath = HashedItem<Path, ContainerHasher<Path>>;
        using CountHashedPaths = std::unordered_map<HashedPath, size_t, HashedPath::Hasher>;
        CountHashedPaths solutions;
    };

    static Data run(const State& state);
};

using FindSolutionAction = async::Action<FindSolution>;
