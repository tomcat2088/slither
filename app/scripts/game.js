var Slither = require("./slither.js");
var Server = require("./server.js");
module.exports = function Game()
{
	var self = this;
	var loginUser = null;

	self.slither = new Slither(); //self
	self.otherSlithers = new Object();//other player's slithers

	self.slitherMap = new Array();
	this.server = new Server("",function(command,obj){
		if(command == self.server.Server_Command_Login)
		{
			loginUser = obj.data;
			self.server.loadMap();
		}
		else if(command == self.server.ServerServer_Command_Sync)
		{
			self.otherSlithers[obj.uid] = obj.data;
		}
		else if(command == self.server.Server_Command_Map)
		{
			self.slitherMap = obj.data;
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
		//self.server.sync(self.slither.serialize());

		var lastPt = self.slither.points[self.slither.points.length - 1];

		for(var prop in self.slitherMap)
		{

		}
	};
}