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
	self.slithers = new Object();
	this.login = function(nickname)
	{
		setTimeout(function(){
			if(commandCallBack)
			{
				//serve
				var slither = new Slither();
				slither.nickname = nickname;
				slither.uid = (new Date()).getTime();
				self.slithers[slither.uid] = slither;
				commandCallBack(self.Server_Command_Login,slither);
			}
		},1000);
	}

	this.syncSlither = function(slither)
	{
		if(commandCallBack)
		{
			self.slithers[slither.uid] = slither;
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
			commandCallBack(self.Server_Command_Map,self.mapUnits);
		}	
	}

	this.catchProp = function(slitherUid,propUid)
	{
		if(self.mapUnits[propUid] && self.slither[slitherUid])
		{
			//TODO: self.slither[slitherUid].catch(self.mapUnits[propUid]);
			delete self.mapUnits[propUid];
			commandCallBack(self.Server_Command_Sync,self.slither[slitherUid]);
		}
	}

	this.kill = function(slitherUid)
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