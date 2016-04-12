#!/usr/local/bin/python3

import asyncio
import websockets
import json
import uuid

users = {};
user_states = {};
sockets = {}

Command_Login = 10000
Command_Sync = 10001

def process_data(data,websocket):
	obj = json.loads(data)
	command = int(obj['command'])
	if command == Command_Login:
		return login_result(websocket)
	elif command == Command_Sync:
		user_id = obj["uid"]
		return sync_result(user_id,obj["data"])

def login_result(websocket):
	uid = str(uuid.uuid1())
	user = {"nickname":uid,"uid":uid}
	users[uid] = user
	sockets[uid] = websocket
	return result(0,Command_Login,user)

def sync_result(user_id,state):
	if user_id in users.keys():
		user_states[user_id] = state
		return result(0,Command_Sync,state)
	return result(-1,Command_Sync,"用户不存在")

def result(code,command,data):
	res = {}
	res["command"] = command
	res["code"] = code
	res["data"] = data
	return res

async def socket_connected(websocket, path):
	while True:
		try:
			data = await websocket.recv()
		except Exception:
			print("closed")
			for key in sockets:
				if sockets[key] == websocket:
					del sockets[key]
					del users[key]
					if key in user_states.keys():
						del user_states[key]
					print(sockets)
					return
		finally:
			pass
		result = process_data(data,websocket)
		for key in sockets:
			if sockets[key] == websocket:
				result['uid'] = key
		for key in sockets:
			await sockets[key].send(json.dumps(result))

start_server = websockets.serve(socket_connected, 'localhost', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()


