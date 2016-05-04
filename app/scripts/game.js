var Slither = require("./slither.js");
var Server = require("./server.js");
//var Server = require("./virtual_server.js");
var Point = require("./math.js");
var SlitherRender = require("./render/slither_render.js");
var SlitherMapRender = require("./render/slither_map_render.js");
var SlitherAI = require("./slither_ai.js");
module.exports = function Game(gameRender)
{
	var self = this;
	self.slither = null; //self

	self.gameRender = gameRender;
	self.gameRender.focusCallback = function()
	{
		if(self.slither)
		{
			var pt = self.slither.points[self.slither.points.length - 1];
			return pt;
		}
		return new Point(0,0);
	}

	

	self.otherSlithers = new Object();//other player's slithers
	self.slitherAIs = new Array();

	self.slitherMap = new Array();
	this.server = new Server("",function(command,obj){
		if(command == self.server.Server_Command_Login)
		{
			self.slither = new Slither(0,0);
			self.slither.deserialize(obj);
			self.gameRender.registerRender(new SlitherRender(self.slither));
			self.begin();
			
			self.server.loadMap();
		}
		else if(command == self.server.Server_Command_SyncSlither)
		{
			if(self.slither && obj.uid == self.slither.uid)
			{
				self.slither.deserialize(obj);
				return;
			}
			if(!self.otherSlithers[obj.uid])
			{
				self.otherSlithers[obj.uid] = new Slither();
				self.gameRender.registerRender(new SlitherRender(self.otherSlithers[obj.uid]),obj.uid);
			}
			self.otherSlithers[obj.uid].deserialize(obj);
				
		}
		else if(command == self.server.Server_Command_Map)
		{
			self.slitherMap = obj;
			if(self.gameRender.isRenderRegistered("SlitherMap") == false)
				self.gameRender.registerRender(new SlitherMapRender(self.slitherMap),"SlitherMap");
			else
			{
				self.gameRender.registeredRender("SlitherMap").map = obj;
			}
		}
		else if(command == self.server.Server_Command_EatFood)
		{
			delete self.slitherMap[obj];
		}
		else if(command == self.server.Server_Command_Logout)
		{
			delete self.otherSlithers[obj];
			self.gameRender.unregisterRender(obj);
		}
		else if(command == self.server.Server_Command_Kill)
		{
			if(obj == self.slither.uid)
			{
				self.end();
				self.slither = null;
				self.otherSlithers = new Object();
				document.location = document.location.href;
			}
		}
	});
	this.server.login("ocean" + Math.random() * 10);

	this.updateHandler = 0;
	this.begin = function()
	{
		self.gameRender.isRunning = true;
		self.updateHandler = setInterval(function(){
			window.game.update(1000/30);
		}, 1000/30);
	}

	this.end = function()
	{
		self.gameRender.isRunning = false;
		clearInterval(self.updateHandler);
	}

	this.update = function(deltaTime)
	{
		deltaTime /= 1000;
		if(self.slither == null)
			return;

		self.slither.update(deltaTime);

		// for(var key in self.slitherAIs)
		// {
		// 	self.slitherAIs[key].update(deltaTime);
		// 	checkSlitherEatFood(self.slitherAIs[key].slither);
		// 	dieTest(self.slither,self.slitherAIs[key].slither);

		// 	if(self.slitherAIs[key].slither.dead)
		// 	{
		// 		delete self.slitherAIs[key];
		// 	}
		// }

		checkSlithersEatFood();
		checkSlitherCollide();

		self.server.syncSlither(self.slither.serialize());

		checkSlitherEatFood(self.slither);

	}

	function checkSlitherEatFood(slither)
	{
		var lastPt = slither.points[slither.points.length - 1];
		for(var prop in self.slitherMap)
		{
			var mapUnit = self.slitherMap[prop];
			var point = new Point(mapUnit.x,mapUnit.y);
			if(point.sub(lastPt).len() <= slither.width && 
				prop.isCatched == undefined)
			{
				self.server.eatFood(prop);
				prop.isCatched = true;
			}
		}
	}

	function checkSlithersEatFood()
	{
		for(var key in self.slitherAIs)
		{
			checkSlitherEatFood(self.slitherAIs[key].slither);
		}
		for(var key in self.otherSlithers)
		{
			checkSlitherEatFood(self.otherSlithers[key]);
		}	
	}

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
			console.log(dieSlither + " die");
			if(dieSlither != self.slither)
			{
				self.server.kill(dieSlither.uid);
				//self.slitherAIs.push(new SlitherAI(window.gameRender));
			}	
		}
	}
}