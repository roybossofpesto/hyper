#!/usr/bin/env python3
# coding: utf-8

import copy
import heapq
import random
import hashlib

def binary(xx):
    return "{0:08b}".format(xx)

assert binary(127 + 256 - 5) == "101111010"

def compare(xx, yy):
    xx_fmt = binary(xx)
    yy_fmt = binary(yy)
    #print("xx", xx, xx_fmt)
    #print("yy", yy, yy_fmt)
    accum = 0
    for xx_bit, yy_bit in zip(xx_fmt, yy_fmt):
        accum += 1 if xx_bit != yy_bit else 0
    return accum

assert compare(2, 1) == 2
assert compare(2, 2) == 0
assert compare(2, 3) == 1
assert compare(2, 4) == 2

assert compare(3, 1) == 1
assert compare(3, 2) == 1
assert compare(3, 3) == 0
assert compare(3, 4) == 3

assert compare(4, 1) == 2
assert compare(4, 2) == 2
assert compare(4, 3) == 3
assert compare(4, 4) == 0

def generate_nexts(xx):
    xx_fmt = binary(xx)
    for kk, xx_bit in enumerate(xx_fmt):
        if xx_bit != '1':
            continue

        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)

        ww = 2 ** (len(xx_fmt) - kk - 1)
        ww_next = 2 ** (len(xx_fmt) - kk_next - 1)
        ww_prev = 2 ** (len(xx_fmt) - kk_prev - 1)

        aa = copy.copy(xx)
        aa &= ~ww
        aa |= ww_next
        yield aa

        bb = copy.copy(xx)
        bb &= ~ww
        bb |= ww_prev
        yield bb

        cc = copy.copy(xx)
        cc &= ~ww
        cc |= ww_next
        cc |= ww_prev
        yield cc

def shortest_path(xx, yy):
    queue = []
    heapq.heappush(queue, (0., xx, None))

    ancestors = {}

    while queue:
        dist, current_value, ancestor_value = heapq.heappop(queue)
        found = current_value in ancestors
        if found:
            continue
        ancestors[current_value] = ancestor_value
        #print("**", dist, binary(current_value), current_value, found, len(ancestors))
        if current_value == yy:
            current = copy.copy(yy)
            path = [current]
            while current in ancestors and ancestors[current] is not None:
                current = ancestors[current]
                path.append(current)
            path.reverse()
            return path
        for next_value in generate_nexts(current_value):
            #print(binary(current_value), "->", binary(next_value))
            heapq.heappush(queue, (dist + random.uniform(0.8, 1.2), next_value, current_value))

    return None


def count_random_paths(xx, yy, seed, max_paths):
    print("shortest paths", binary(xx), "->", binary(yy))
    random.seed(seed)
    seen_paths = {}
    count_paths = {}
    count_failure = 0
    for path in range(max_paths):
        path = shortest_path(xx, yy)
        if path is None:
            #print(count_path, "NO PATH")
            count_failure += 1
            continue
        path = tuple(path)
        path_hash = hash(path)
        if path_hash in seen_paths:
            #print("DUPLICATE SOLUTION")
            assert path_hash in count_paths
            count_paths[path_hash] += 1
            continue
        seen_paths[path_hash] = path
        count_paths[path_hash] = 1
        #print("REACHED SOLUTION")
    return [(path, count_paths[path_hash]) for path_hash, path in seen_paths.items()], count_failure

import argparse
parser = argparse.ArgumentParser(description='Shortest paths.')
parser.add_argument('xx', metavar="X", type=int, help="start")
parser.add_argument('yy', metavar="Y", type=int, help="finish")
parser.add_argument('--num-try', dest='total', type=int, default=1024, help="number of random paths")
parser.add_argument('--seed', dest='seed', type=int, default=42, help="rng seed")
args = parser.parse_args()
print("seed {0} / {1} try".format(args.seed, args.total))

paths, failure = count_random_paths(args.xx, args.yy, args.seed, args.total)
print("{0:.1f}% failure rate".format(100 * failure / args.total))
print("found {0} shortest paths".format(len(paths)))
for path, count in paths:
    print("========== {0} {1:.1f}%".format(count, 100 * count / args.total))
    for kk, step in enumerate(path):
        print(kk, binary(step))

