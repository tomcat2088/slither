var Socket = require("./socket.js");
function Server(serverUrl,commandCallBack)
{
	var self = this;

	self.Server_Command_Login = 10000;
	self.Server_Command_SyncSlither = 10001;
	self.Server_Command_Map = 10002;
	self.Server_Command_Kill = 10003;
	self.Server_Command_EatFood = 10004;
	self.Server_Command_Logout = 10005;

	self.Server_Command_SyncSlitherExceptPoints = 10006;

	self.commandCallBack = commandCallBack;

	self.avaliable = false;

	var websocket;
	this.login = function(nickname)
	{
		if(websocket)
			return;
		websocket = new Socket("ws://192.168.0.100:8081",'slither');//serverUrl
		websocket.onmessage = function(e)
		{
			var obj = JSON.parse(e.data);
			processResponse(obj);
		}
		websocket.onopen = function(e)
		{
			console.log("Connect success!!! Begin login...");
			sendCommand(self.Server_Command_Login,{'nickname':nickname});
		}
	}

	this.loadMap = function()
	{
		sendCommand(self.Server_Command_Map,"");	
	}

	this.syncSlither = function(slither)
	{
		sendCommand(self.Server_Command_SyncSlither,slither);	
	}

	this.syncSlitherExceptPoints = function(slither)
	{
		sendCommand(self.Server_Command_SyncSlitherExceptPoints,slither);	
	}

	this.eatFood = function(uid)
	{
		sendCommand(self.Server_Command_EatFood,uid);	
	}

	this.kill = function(uid)
	{
		sendCommand(self.Server_Command_Kill,uid);
	}

	function processResponse(obj)
	{
		if(obj.code != 0)
		{
			console.log("error:" + obj.data);
			return;
		}
		else
		{
			if(self.commandCallBack)
			{
				self.commandCallBack(obj.command,obj.data);
			}
		}
	}

	function sendCommand(command,data)
	{
		if(websocket == null)
			return;
		var result = new Object();
		result.command = command;
		result.data = data;
		websocket.send(JSON.stringify(result));
	}
}

module.exports = Server;