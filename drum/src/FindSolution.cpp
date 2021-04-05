#include "FindSolution.h"

#include <spdlog/spdlog.h>

#include <queue>
#include <random>

bool FindSolutionState::operator!=(const FindSolutionState& other) const {
    if (pattern_length != other.pattern_length) return true;
    if (input_value != other.input_value) return true;
    if (output_value != other.output_value) return true;
    if (rng_seed != other.rng_seed) return true;
    return false;
}

using UnsignedIntegral = uint32_t;
using Rng = std::mt19937_64;

std::vector<UnsignedIntegral> generate_nexts(const UnsignedIntegral pattern_length, const UnsignedIntegral value) {
    std::vector<UnsignedIntegral> nexts;
    for (UnsignedIntegral kk=0; kk<pattern_length; kk++) {
        const UnsignedIntegral mask = 1 << kk;
        const bool is_bit_on = (value & mask) != 0;
        if (!is_bit_on)
            continue;

        const UnsignedIntegral kk_next = (kk + 1) % pattern_length;
        const UnsignedIntegral kk_prev = (kk + pattern_length - 1) % pattern_length;
        const UnsignedIntegral mask_next = 1 << kk_next;
        const UnsignedIntegral mask_prev = 1 << kk_prev;

        {
            UnsignedIntegral next = value;
            next &= ~mask;
            next |= mask_next;
            nexts.emplace_back(next);
        }

        {
            UnsignedIntegral next = value;
            next &= ~mask;
            next |= mask_prev;
            nexts.emplace_back(next);
        }

        {
            UnsignedIntegral next = value;
            next &= ~mask;
            next |= mask_next;
            next |= mask_prev;
            nexts.emplace_back(next);
        }
    }
    return nexts;
}

using Tuple = std::tuple<float, UnsignedIntegral>;

struct TupleLess {
    bool operator()(const Tuple& aa, const Tuple& bb) const {
        using std::get;
        if (get<0>(aa) != get<0>(bb)) return get<0>(aa) > get<0>(bb);
        return get<1>(aa) < get<1>(bb);
    }
};

std::vector<UnsignedIntegral> shortest_path(const UnsignedIntegral pattern_length, const UnsignedIntegral input_value, const UnsignedIntegral output_value, Rng& rng) {
    using Queue = std::priority_queue<Tuple, std::vector<Tuple>, TupleLess>;
    using Ancestors = std::unordered_map<UnsignedIntegral, UnsignedIntegral>;
    using Dist = std::uniform_real_distribution<float>;

    Queue queue;
    Ancestors ancestors;
    Dist dist(0.8, 1.2);

    queue.emplace(Tuple{0., input_value});
    ancestors.insert(std::make_pair(input_value, input_value));

    while (!queue.empty()) {
        const Tuple current_tuple = queue.top();
        const auto& current_distance = std::get<0>(current_tuple);
        const auto& current_value = std::get<1>(current_tuple);
        queue.pop();

        spdlog::debug("** dist {1} value {2:0{0}b} nancestors {3}", pattern_length, current_distance, current_value, ancestors.size());
        assert(ancestors.find(current_value) != std::cend(ancestors));

        if (current_value == output_value) {
            UnsignedIntegral current = current_value;
            std::vector<UnsignedIntegral> path = {current};
            Ancestors::const_iterator iter = ancestors.find(current);
            while (iter != std::cend(ancestors) && iter->second != iter->first) {
                current = iter->second;
                path.emplace_back(current);
                iter = ancestors.find(current);
            }
            return path;
        }

        for (const auto next_value : generate_nexts(pattern_length, current_value)) {
            if (ancestors.find(next_value) != std::cend(ancestors))
                continue;
            spdlog::debug("{1:0{0}b} -> {2:0{0}b}", pattern_length, current_value, next_value);
            queue.emplace(Tuple{current_distance + dist(rng), next_value});
            ancestors.insert(std::make_pair(next_value, current_value));
        }
    }

    return {};
}

std::vector<int> reverse_and_cast(const std::vector<UnsignedIntegral>& path) {
    std::vector<int> path_;
    for (auto iter=std::crbegin(path), end=std::crend(path); iter!=end; iter++)
        path_.emplace_back(static_cast<int>(*iter));
    return path_;
}

FindSolutionData find_solution(const FindSolutionState& state) {
    spdlog::critical("find solution {1:0{0}b} -> {2:0{0}b} {0}bits", state.pattern_length, state.input_value, state.output_value);

    Rng rng(static_cast<size_t>(state.rng_seed));

    FindSolutionData data;
    data.solution = reverse_and_cast(shortest_path(state.pattern_length, state.input_value, state.output_value, rng));

    spdlog::critical(data.solution.empty() ? "no solution" : "{0} steps solution", data.solution.size());


    return data;
}
