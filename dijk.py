#!/usr/bin/env python3
# coding: utf-8

import copy

def binary(xx):
    return "{0:08b}".format(xx % 256)

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

xx = 5
print(binary(xx))
for xx_ in generate_nexts(xx):
    print(binary(xx), "->", binary(xx_))

