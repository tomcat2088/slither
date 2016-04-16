var Server_Command_Login = 10000;
var Server_Command_Sync = 10001;
var Server_Command_Message = 10002;
var Server_Command_Logout = 10003;
var Server_Command_Map = 10004;
var Server_Command_CatchProp = 10005;


function Server(serverUrl,commandCallBack)
{
	var self = this;

	self.commandCallBack = commandCallBack;

	self.avaliable = false;
	self.loginUser = null;

	var websocket;
	this.login = function(nickname)
	{
		if(websocket)
			return;
		websocket = new WebSocket("ws://localhost:8765");//serverUrl
		websocket.onopen = function(e)
		{
			console.log("Connect success!!! Begin login...");
			sendCommand(Server_Command_Login,{'nickname':nickname});
		}
		websocket.onmessage = function(e)
		{
			var obj = JSON.parse(e.data);
			processResponse(obj);
		}
	}

	this.sync = function(data)
	{
		sendCommand(Server_Command_Sync,data);	
	}

	this.loadMap = function()
	{
		sendCommand(Server_Command_Map,"");	
	}

	this.catchProp = function(uid)
	{
		sendCommand(Server_Command_CatchProp,uid);	
	}

	//process response
	function loginResponse(obj)
	{
		console.log("Login Success > " + obj.data.uid);
		self.loginUser = obj.data;
		if(self.commandCallBack)
		{
			self.commandCallBack(Server_Command_Login,obj);
		}
	}

	function syncResponse(obj)
	{
		if(self.commandCallBack)
		{
			self.commandCallBack(Server_Command_Sync,obj);
		}
	}

	function logoutResponse(obj)
	{
		if(self.commandCallBack)
		{
			self.commandCallBack(Server_Command_Logout,obj);
		}
	}

	function responseProcessMap()
	{
		return {10000:loginResponse,
				10001:syncResponse,
				10003:logoutResponse};
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
			var func = responseProcessMap()[obj.command];
			if(func)
			{
				func(obj);
			}
			else
			{
				if(self.commandCallBack)
				{
					self.commandCallBack(obj.command,obj);
				}
			}
		}
	}

	function sendCommand(command,data)
	{
		if(websocket == null)
			return;
		var result = new Object();
		if(command != Server_Command_Login)
			if(self.loginUser)
				result.uid = self.loginUser.uid;
			else
				return
		result.command = command;
		result.data = data;
		websocket.send(JSON.stringify(result));
	}
}