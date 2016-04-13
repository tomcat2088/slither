import sys
sys.path.insert(0, r'../')

import slithermap

map = slithermap.gen_slither_map(0,0,100,100,100)

print(map)
