#!/usr/local/bin/python3

import asyncio
import websockets
import json
import uuid

users = {};
slithers = {};
sockets = {}

Command_Login = 10000
Command_Sync = 10001
Command_Message = 10002
Command_Logout = 10003

#struct
def User(uid,nickname):
	if uid == "":
		uid = str(uuid.uuid1())
	user = {};
	user['uid'] = uid
	user['nickname'] = nickname
	return user

def login(data,websocket):
	obj = json.loads(data)
	print(obj)
	command = int(obj['command'])
	if command == Command_Login:
		user = User('',obj['data']['nickname'])
		uid = user['uid']
		sockets[uid] = websocket
		users[uid] = user
		print(user['nickname'] + ' login success!! > ' + user['uid'])
		return user
	return None

async def sync(uid,data):
	ret = result(0,Command_Sync,uid,data)
	for key in sockets:
		await sockets[key].send(json.dumps(ret))


async def logout(uid):
	ret = result(0,Command_Logout,uid,'')
	print(uid + " is loging out")
	for key in sockets:
		if key != uid:
			print("tell " + key + " sth is loging out")
			await sockets[key].send(json.dumps(ret))
	clean(uid)

def clean(uid):
	if uid in sockets.keys():
		del sockets[uid]
	if uid in users.keys():
		del users[uid]
	if uid in slithers.keys():
		del slithers[uid]

def result(code,command,uid,data):
	res = {}
	res["command"] = command
	res['uid'] = uid
	res["code"] = code
	res["data"] = data
	return res

async def accept_connection(websocket, path):
	data = await websocket.recv()
	user = login(data,websocket)
	if user == None:
		websocket.close()
		print("First request is not login,Force quit!!!");
	else:
		await websocket.send(json.dumps(result(0,Command_Login,user['uid'],user)))
	while True:
		try:
			data = await websocket.recv()
		except Exception:
			print("Exception Occur!Close It")
			await logout(user['uid'])
			return

		obj = json.loads(data)
		command = int(obj['command'])
		if command == Command_Sync:
			await sync(obj['uid'],obj['data'])

start_server = websockets.serve(accept_connection, 'localhost', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()


