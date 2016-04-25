module.exports = function Server(serverUrl,commandCallBack)
{
	var self = this;

	self.Server_Command_Login = 10000;
	self.Server_Command_Sync = 10001;
	self.Server_Command_Message = 10002;
	self.Server_Command_Logout = 10003;
	self.Server_Command_Map = 10004;
	self.Server_Command_CatchProp = 10005;
	self.Server_Command_Kill = 10006;

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
			sendCommand(self.Server_Command_Login,{'nickname':nickname});
		}
		websocket.onmessage = function(e)
		{
			var obj = JSON.parse(e.data);
			processResponse(obj);
		}
	}

	this.sync = function(data)
	{
		sendCommand(self.Server_Command_Sync,data);	
	}

	this.loadMap = function()
	{
		sendCommand(self.Server_Command_Map,"");	
	}

	this.catchProp = function(uid)
	{
		sendCommand(self.Server_Command_CatchProp,uid);	
	}

	this.kill = function(slither)
	{
		sendCommand(self.Server_Command_Kill,uid);
	}

	//process response
	function loginResponse(obj)
	{
		console.log("Login Success > " + obj.data.uid);
		self.loginUser = obj.data;
		if(self.commandCallBack)
		{
			self.commandCallBack(self.Server_Command_Login,obj);
		}
	}

	function syncResponse(obj)
	{
		if(self.commandCallBack)
		{
			self.commandCallBack(self.Server_Command_Sync,obj);
		}
	}

	function logoutResponse(obj)
	{
		if(self.commandCallBack)
		{
			self.commandCallBack(self.Server_Command_Logout,obj);
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
		if(command != self.Server_Command_Login)
			if(self.loginUser)
				result.uid = self.loginUser.uid;
			else
				return
		result.command = command;
		result.data = data;
		websocket.send(JSON.stringify(result));
	}
}
