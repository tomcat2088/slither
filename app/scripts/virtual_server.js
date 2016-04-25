module.exports = function VirtualServer(url,commandCallBack)
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
	self.loginUser = null;
	self.slithers = new Object();
	this.login = function(name)
	{
		setTimeout(function(){
			if(commandCallBack)
			{
				self.loginUser = {nickname:name,uid:"uid"};
				commandCallBack(self.Server_Command_Login,self.loginUser);
			}
		},1000);
	}
	this.sync = function(data)
	{
		if(commandCallBack)
		{
			self.slithers[data.uid] = data;
			//commandCallBack(self.Server_Command_Sync,data);
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
					self.mapUnits[i] = {uid:i,x:Math.random() * 1000,y:Math.random() * 1000};
				}
			}
			commandCallBack(self.Server_Command_Map,{data:self.mapUnits});
		}	
	}

	this.catchProp = function(uid)
	{
		if(self.mapUnits[uid])
		{
			delete self.mapUnits[uid];
			commandCallBack(self.Server_Command_CatchProp,{data:{uid:uid}});
		}
	}

	this.kill = function(slither)
	{
		for(var key in slither.points)
		{
			var pt = slither.points[key];
			var uid = (new Date()).getTime() + "-" + key;
			self.mapUnits[uid] = {uid:uid,x:pt.x,y:pt.y};
		}
		commandCallBack(self.Server_Command_Map,{data:self.mapUnits});
	}
}