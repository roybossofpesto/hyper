#pragma once

#include <functional>

template <typename Value>
void hash_combine(size_t& seed, const Value& vv);

template <typename Value>
void
hash_combine(size_t& seed, const Value& vv)
{
    std::hash<Value> hasher;
    seed ^= hasher(vv) + 0x9e3779b9 + (seed << 6) + (seed >> 2); // magic random number ensures spreading of hashes
}

template <typename Container>
struct ContainerHasher {
    size_t operator()(const Container& container) const;
};


template <typename Container>
size_t
ContainerHasher<Container>::operator()(const Container& container) const
{
    size_t seed = 0xa7b512ff; // non magic random number
    for (const auto& vv : container)
        hash_combine(seed, vv);
    return seed;
}
