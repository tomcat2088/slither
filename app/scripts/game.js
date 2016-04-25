var Slither = require("./slither.js");
var Server = require("./server.js");
var Point = require("./math.js");
var SlitherRender = require("./render/slither_render.js");
var SlitherMapRender = require("./render/slither_map_render.js");
module.exports = function Game()
{
	var self = this;
	var loginUser = null;

	self.slither = new Slither(); //self
	self.otherSlithers = new Object();//other player's slithers
	self.slitherAIs = new Array();

	self.slitherMap = new Array();
	this.server = new Server("",function(command,obj){
		if(command == self.server.Server_Command_Login)
		{
			loginUser = obj.data;
			self.server.loadMap();
		}
		else if(command == self.server.Server_Command_Sync)
		{
			if(obj.uid == self.server.loginUser.uid)
			{
				self.slither.deserialize(obj.data);
				return;
			}
			if(!self.otherSlithers[obj.uid])
			{
				self.otherSlithers[obj.uid] = new Slither();
				window.gameRender.registerRender(new SlitherRender(self.otherSlithers[obj.uid]),obj.uid);
			}
			self.otherSlithers[obj.uid].deserialize(obj.data);
				
		}
		else if(command == self.server.Server_Command_Map)
		{
			self.slitherMap = obj.data;
			window.gameRender.registerRender(new SlitherMapRender(self.slitherMap));
		}
		else if(command == self.server.Server_Command_CatchProp)
		{
			delete self.slitherMap[obj.data.uid];
		}
		else if(command == self.server.Server_Command_Logout)
		{
			delete self.otherSlithers[obj.uid];
		}
	});
	this.server.login("ocean");

	this.update = function(deltaTime)
	{
		deltaTime /= 1000;

		self.slither.update(deltaTime);

		for(var key in self.slitherAIs)
		{
			self.slitherAIs[key].update(deltaTime);
		}

		self.server.sync(self.slither.serialize());

		var lastPt = self.slither.points[self.slither.points.length - 1];

		for(var prop in self.slitherMap)
		{
			var mapUnit = self.slitherMap[prop];
			var point = new Point(mapUnit.x,mapUnit.y);
			if(point.sub(lastPt).len() <= self.slither.width && 
				prop.isCatched == undefined)
			{
				self.server.catchProp(prop);
				prop.isCatched = true;
			}
		}
	};

	function checkSlitherCollide()
	{
		for(var key in self.slitherAIs)
		{
			dieTest(self.slither,self.slitherAIs[key]);
		}
		for(var key in self.otherSlithers)
		{
			dieTest(self.slither,self.otherSlithers[key]);
		}	
	}

	function dieTest(slither1,slither2)
	{
		var dieSlither = slither1.dieTest(slither2);
		if(dieSlither)
		{
			dieSlither.die();
			if(dieSlither.uid)
				self.server.kill(dieSlither.uid);	
		}
	}
}