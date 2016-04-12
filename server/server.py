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
Command_Message = 10002
Command_Logout = 10003

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
	print(sockets)
	return result(0,Command_Login,uid,user)

def sync_result(user_id,state):
	if user_id in users.keys():
		user_states[user_id] = state
		return result(0,Command_Sync,user_id,state)
	return result(-1,Command_Sync,0,"用户不存在")

def logout_result(user_id):
	return result(0,Command_Sync,user_id,"")

def result(code,command,uid,data):
	res = {}
	res["command"] = command
	if uid:
		res['uid'] = uid
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
		if result["command"] == Command_Sync:
			for key in sockets:
				if sockets[key] == websocket:
					result['uid'] = key
					result['nickname'] = users[key]["nickname"]
			for key in sockets:
				await sockets[key].send(json.dumps(result))
		else:
			await websocket.send(json.dumps(result))

start_server = websockets.serve(socket_connected, '192.168.2.1', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()


