function VirtualServer(commandCallBack)
{
	//sync,eat food,kill slither,load map
	var self = this;

	self.Server_Command_Login = 10000;
	self.Server_Command_Sync = 10001;
	self.Server_Command_Message = 10002;
	self.Server_Command_Logout = 10003;
	self.Server_Command_Map = 10004;
	self.Server_Command_CatchProp = 10005;
	self.Server_Command_Kill = 10006;

	self.mapUnits = new Array();
	this.sync = function(data)
	{
		if(commandCallBack)
		{
			commandCallBack(self.Server_Command_Sync,data);
		}
	}

	this.loadMap = function()
	{
		if(commandCallBack)
		{
			if(self.mapUnits.length <= 0)
			{
				self.mapUnits = new Array();
				for(var i=0;i<50;i++)
				{
					self.mapUnits[uid] = {uid:i,x:Math.random() * 1000,y:Math.random() * 1000};
				}
			}
			commandCallBack(self.Server_Command_Map,JSON.stringify(self.mapUnits));
		}	
	}

	this.catchProp = function(uid)
	{
		if(self.mapUnits[uid])
		{
			delete self.mapUnits[uid];
			commandCallBack(self.Server_Command_CatchProp,uid);
		}
	}

	this.kill = function(uid)
	{
		commandCallBack(self.Server_Command_Kill,uid);
	}
}

var virtualServer = new VirtualServer();
module.exports = virtualServer;