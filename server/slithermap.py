import random
import uuid
def gen_slither_map(start_x,start_y,stop_x,stop_y,count):
	map = {}
	for index in range(0,count):
		x = random.randrange(start_x,stop_x,1)
		y = random.randrange(start_y,stop_y,1)
		uid = str(uuid.uuid1())
		map[uid] = ({'uid':uid,'x':x,'y':y})
	return map