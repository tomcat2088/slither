function Game()
{
	var self = this;
	var loginUser = null;

	self.slither = new Slither(); //self
	self.otherSlithers = new Object();//other player's slithers

	self.slitherMap = new Array();
	this.server = new Server("",function(command,obj){
		if(command == Server_Command_Login)
		{
			loginUser = obj.data;
			self.server.loadMap();
		}
		else if(command == Server_Command_Sync)
		{
			self.otherSlithers[obj.uid] = obj.data;
		}
		else if(command == Server_Command_Map)
		{
			self.slitherMap = obj.data;
		}
		else if(command == Server_Command_CatchProp)
		{
			delete self.slitherMap[obj.data.uid];
		}
		else if(command == Server_Command_Logout)
		{
			delete self.otherSlithers[obj.uid];
		}
	});
	this.server.login("ocean");

	this.update = function(deltaTime)
	{
		self.slither.update(deltaTime);
		self.server.sync(self.slither.serialize());

		var lastPt = self.slither.points[self.slither.points.length - 1];
		//debugDraw.drawSlithers({"main":slither},new Point(400 - lastPt.x,300 - lastPt.y));
		debugDraw.drawSlithers(self.otherSlithers,new Point(400 - lastPt.x,300 - lastPt.y));
		debugDraw.drawMap(self.slitherMap,new Point(400 - lastPt.x,300 - lastPt.y));
	}
}