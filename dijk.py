# coding: utf-8
xx = 42
str(xx, 42)
"{0:b}".format(xx)
"{0:08b}".format(xx)
yy=3
def compare(xx, yy):
    xx_fmt = "{0:08b}".format(xx)
    yy_fmt = "{0:08b}".format(yy)
    accum = 0
    for xx_bit, yy_bit in zip(xx_fmt, yy_fmt):
        accum += 1 if xx_bit != yy_bit else 0
    return accum
compare(3, 3)
compare(3, 1)
compare(3, 2)
compare(3, 4)
def generate_nexts(xx):
    xx_fmt = "{0:08b)".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print(2**kk if xx_bit else 0, xx_bit)
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
         
generate_nexts(2)
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print(2**kk if xx_bit else 0, xx_bit)
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
         
generate_nexts(2)
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print(2**kk if xx_bit else 0, xx_bit)
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        aa = copy(xx_fmt)
        aa[kk] = '0'
        aa[kk_prev] = '1'
        print(xx_fmt, "->", aa)
        
         
generate_nexts(2)
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print("****", kk, xx_bit)
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        aa = copy(xx_fmt)
        print("aa", aa)
        aa[kk] = '0'
        aa[kk_prev] = '1'
        print(xx_fmt, "->", aa)
        
         
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print("****", kk, xx_bit)
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        aa = copy(xx_fmt)
        print("aa", aa)
        aa[kk] = '0'
        aa[kk_prev] = '1'
        print(xx_fmt, "->", aa)
        
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print("****", kk, xx_bit)
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        aa = copy(xx_fmt)
        print("aa", aa)
        aa[kk] = '0'
        aa[kk_prev] = '1'
        print(xx_fmt, "->", aa)
generate(5)
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print("****", kk, xx_bit)
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        aa = copy(xx_fmt)
        print("aa", aa)
        aa[kk] = '0'
        aa[kk_prev] = '1'
        print(xx_fmt, "->", aa)
generate_nexts(5)
import copy
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print("****", kk, xx_bit)
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        aa = copy.copy(xx_fmt)
        print("aa", aa)
        aa[kk] = '0'
        aa[kk_prev] = '1'
        print(xx_fmt, "->", aa)
generate_nexts(5)
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print("****", kk, xx_bit)
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        aa = copy.copy(xx_fmt)
        print("aa", aa, kk)
        aa[kk] = '0'
        aa[kk_prev] = '1'
        print(xx_fmt, "->", aa)
generate_nexts(5)
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print("****", kk, xx_bit)
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        aa = copy.copy(xx)
        print("aa", aa, 2 ** (len(xx_fmt) - kk))
        #aa[kk] = '0'
        #aa[kk_prev] = '1'
        print(xx_fmt, "->", "{0:08b}".format(aa))
generate_nexts(5)
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print("****", kk, xx_bit)
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        ww = 2 ** (len(xx_fmt) - kk)
        aa = copy.copy(xx)
        print("aa", aa, ww, "${0:08b}".format(ww))
        #aa[kk] = '0'
        #aa[kk_prev] = '1'
        print(xx_fmt, "->", "{0:08b}".format(aa))
generate_nexts(5)
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print("****", kk, xx_bit)
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        ww = 2 ** (len(xx_fmt) - kk - 1)
        aa = copy.copy(xx)
        print("aa", aa, "ww", ww, "{0:08b}".format(ww))
        #aa[kk] = '0'
        #aa[kk_prev] = '1'
        print(xx_fmt, "->", "{0:08b}".format(aa))
generate_nexts(5)
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print("****", kk, xx_bit)
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        ww = 2 ** (len(xx_fmt) - kk - 1)
        aa = copy.copy(xx)
        print("aa", aa, "ww", ww, "{0:08b}".format(~ww))
        aa &= ~ww
        #aa[kk] = '0'
        #aa[kk_prev] = '1'
        print(xx_fmt, "->", "{0:08b}".format(aa))
generate_nexts(5)
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print("****", kk, xx_bit)
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        ww = 2 ** (len(xx_fmt) - kk - 1)
        aa = copy.copy(xx)
        print("aa", aa, "ww", ww, "{0:08b}".format(~ww % 256))
        aa &= ~ww
        #aa[kk] = '0'
        #aa[kk_prev] = '1'
        print(xx_fmt, "->", "{0:08b}".format(aa))
generate_nexts(5)
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print("****", kk, xx_bit)
        if not xx_bit:
            continue
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        ww = 2 ** (len(xx_fmt) - kk - 1)
        aa = copy.copy(xx)
        print("aa", aa, "ww", ww, "{0:08b}".format(~ww % 256))
        aa &= ~ww
        #aa[kk] = '0'
        #aa[kk_prev] = '1'
        print(xx_fmt, "->", "{0:08b}".format(aa))
generate_nexts(5)
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print("****", kk, xx_bit)
        if xx_bit != '1':
            continue
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        ww = 2 ** (len(xx_fmt) - kk - 1)
        aa = copy.copy(xx)
        print("aa", aa, "ww", ww, "{0:08b}".format(~ww % 256))
        aa &= ~ww
        #aa[kk] = '0'
        #aa[kk_prev] = '1'
        print(xx_fmt, "->", "{0:08b}".format(aa))
generate_nexts(5)
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print("****", kk, xx_bit)
        if xx_bit != '1':
            continue
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        ww = 2 ** (len(xx_fmt) - kk - 1)
        ww_next = 2 ** (len(xx_fmt) - kk_next -1)
        aa = copy.copy(xx)
        print("aa", aa, "ww", ww, "{0:08b}".format(~ww % 256))
        aa &= ~ww
        aa &= ww_next
        #aa[kk] = '0'
        #aa[kk_prev] = '1'
        print(xx_fmt, "->", "{0:08b}".format(aa))
generate_nexts(5)
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print("****", kk, xx_bit)
        if xx_bit != '1':
            continue
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        ww = 2 ** (len(xx_fmt) - kk - 1)
        ww_next = 2 ** (len(xx_fmt) - kk_next -1)
        aa = copy.copy(xx)
        print("aa", aa)
        print("ww", ww, "{0:08b}".format(~ww % 256))
        print("xx_next", ww_next, "{0:08b}".format(ww_next))
        aa &= (~ww % 256)
        #aa &= ww_next
        #aa[kk_prev] = '1'
        print(xx_fmt, "->", "{0:08b}".format(aa))
generate_nexts(5)
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print("****", kk, xx_bit)
        if xx_bit != '1':
            continue
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        ww = 2 ** (len(xx_fmt) - kk - 1)
        ww_next = 2 ** (len(xx_fmt) - kk_next -1)
        aa = copy.copy(xx)
        print("aa", aa)
        print("ww     ", ww, "{0:08b}".format(~ww % 256))
        print("ww_next", ww_next, "{0:08b}".format(ww_next))
        aa &= (~ww % 256)
        #aa &= ww_next
        #aa[kk_prev] = '1'
        print(xx_fmt, "->", "{0:08b}".format(aa))
generate_nexts(5)
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print("****", kk, xx_bit)
        if xx_bit != '1':
            continue
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        ww = 2 ** (len(xx_fmt) - kk - 1)
        ww_next = 2 ** (len(xx_fmt) - kk_next -1)
        aa = copy.copy(xx)
        print("aa", aa)
        print("ww     ", ww, "{0:08b}".format(~ww % 256))
        print("ww_next", ww_next, "{0:08b}".format(ww_next))
        aa &= (~ww % 256)
        aa |= ww_next
        #aa[kk_prev] = '1'
        print(xx_fmt, "->", "{0:08b}".format(aa))
generate_nexts(5)
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print("****", kk, xx_bit)
        if xx_bit != '1':
            continue
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        ww = 2 ** (len(xx_fmt) - kk - 1)
        ww_next = 2 ** (len(xx_fmt) - kk_next -1)
        aa = copy.copy(xx)
        print("aa", aa)
        print("ww     ", ww, "{0:08b}".format(~ww % 256))
        print("ww_next", ww_next, "{0:08b}".format(ww_next))
        aa &= ~ww
        aa |= ww_next
        #aa[kk_prev] = '1'
        print(xx_fmt, "->", "{0:08b}".format(aa))
generate_nexts(5)
def generate_nexts(xx):
    xx_fmt = "{0:08b}".format(xx)
    print(xx_fmt)
    for kk, xx_bit in enumerate(xx_fmt):
        print("****", kk, xx_bit)
        if xx_bit != '1':
            continue
        kk_next = (kk + 1) % len(xx_fmt)
        kk_prev = (kk + len(xx_fmt) - 1) % len(xx_fmt)
        print(kk_prev, kk, kk_next)
        ww = 2 ** (len(xx_fmt) - kk - 1)
        ww_next = 2 ** (len(xx_fmt) - kk_next - 1)
        ww_prev = 2 ** (len(xx_fmt) - kk_next - 1)
        aa = copy.copy(xx)
        bb = copy.copy(xx)
        print("aa", aa)
        print("ww     ", ww, "{0:08b}".format(~ww % 256))
        print("ww_next", ww_next, "{0:08b}".format(ww_next))
        aa &= ~ww
        aa |= ww_next
        #aa[kk_prev] = '1'
        print(xx_fmt, "->", "{0:08b}".format(aa))
generate_nexts(5)
