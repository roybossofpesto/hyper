#pragma once

#include <tuple>

template <typename Item, typename ItemHasher>
struct HashedItem : std::tuple<const size_t, const Item> {
    HashedItem(Item&& item);

    struct Hasher {
        size_t operator()(const HashedItem& item) const;
    };
};

template <typename Item, typename ItemHasher>
HashedItem<Item, ItemHasher>::HashedItem(Item&& item) : std::tuple<const size_t, const Item>(ItemHasher()(item), std::move(item))
{
}

template <typename Item, typename ItemHasher>
size_t
HashedItem<Item, ItemHasher>::Hasher::operator()(const HashedItem& hashed_item) const {
    return std::get<0>(hashed_item);
}
