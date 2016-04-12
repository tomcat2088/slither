var Command_Login = 10000;
var Command_Sync = 10001;
var Command_Message = 10002;
var Command_Logout = 10003;

var user;
var users = new Object();
var callback;


function setSocketUpdateCallBack(cb)
{
	callback = cb;
}

var websocket = new WebSocket("ws://localhost:8765");
websocket.onopen = function(e)
{
	console.log("Connect success!!! Begin login...");
	login();
}

websocket.onmessage = function(e)
{
	var obj = JSON.parse(e.data);
	if(obj.code != 0)
	{
		console.log("error:" + obj.data);
		return;
	}
	if(obj.command == Command_Login)
	{
		console.log("Login Success > " + obj.data.uid);
		user = obj.data;
		loginSuccess();
	}
	else if(obj.command == Command_Sync)
	{
		//console.log("Sync Response > " + obj.uid);
		users[obj.uid] = obj;

		if(callback)
		{
			callback(users);
		}
	}
	else if(obj.command == Command_Logout)
	{
		//console.log("Sync Response > " + obj.uid);
		delete users[obj.uid];

		if(callback)
		{
			callback(users);
		}
	}
}

function login()
{
	sendCommand(Command_Login,{'nickname':'ocean'});
}

function loginSuccess()
{
	// window.addEventListener("mousemove",function(e){
	// 	if(user)
			
	// });
}

function sendCommand(command,data)
{
	var result = new Object();
	if(command != Command_Login)
		if(user)
			result.uid = user.uid;
		else
			return
	result.command = command;
	result.data = data;
	websocket.send(JSON.stringify(result));
}
