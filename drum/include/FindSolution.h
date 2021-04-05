#pragma once

#include <vector>
#include <tuple>
#include <memory>
#include <future>
#include <cassert>

namespace async {

template <typename Derived>
class Action {
public:
    using State = typename Derived::State;
    using Data = typename Derived::Data;

    bool running() const;
    bool valid() const;
    const State& validState() const;
    const Data& validData() const;

    bool update(const State& state);

protected:
    using Result = std::tuple<State, Data>;
    using MaybeResult = std::unique_ptr<Result>;
    using Future = std::future<MaybeResult>;

    MaybeResult maybe_result = nullptr;
    Future future;
};

}

template <typename Derived>
bool
async::Action<Derived>::running() const
{
    return future.valid();
}

template <typename Derived>
bool
async::Action<Derived>::valid() const
{
    return static_cast<bool>(maybe_result);
}

template <typename Derived>
auto
async::Action<Derived>::validState() const -> const State&
{
    assert(valid());
    return std::get<0>(*maybe_result);
}

template <typename Derived>
auto
async::Action<Derived>::validData() const -> const Data&
{
    assert(valid());
    return std::get<1>(*maybe_result);
}

template <typename Derived>
bool
async::Action<Derived>::update(const State& state)
{
    const bool should_trigger = !valid() || state != validState();

    const bool should_run_async = !running() && should_trigger;
    if (should_run_async)
    {
        const auto state_ = state;
        future = std::async(std::launch::async, [state_]() -> MaybeResult {
            return std::make_unique<Result>(std::move(state_), Derived::run(state_));
        });
        assert(future.valid());
    }

    const auto should_run_finally = future.valid() ? future.wait_for(std::chrono::seconds(0)) == std::future_status::ready : false;
    if (should_run_finally)
    {
        maybe_result = future.get();
        assert(!future.valid());
        assert(maybe_result);
        return true;
    }

    return false;
}

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
