function Game()
{
	var self = this;
	var loginUser = null;

	var slither; //self
	var otherSlithers = new Object();//other player's slithers

	var slitherMap;
	this.server = new Server("",function(command,obj){
		console.log(command + ":" + JSON.stringify(obj));
		if(command == Server_Command_Login)
		{
			loginUser = obj.data;
			self.server.loadMap();
		}
		else if(command == Server_Command_Sync)
		{
			otherSlithers[obj.uid] = obj.data;
			console.log(otherSlithers);
		}
		else if(command == Server_Command_Map)
		{
			slitherMap = obj.data;
			drawMap();
		}
		else if(command == Server_Command_CatchProp)
		{
			delete slitherMap[obj.data.uid];
			drawMap();
		}
	});
	this.server.login("ocean");


	function drawMap()
	{
		var context = document.getElementById("canvas").getContext('2d');
		context.fillStyle = "#fff";
		context.fillRect(0,0,context.canvas.width,context.canvas.height);
		for(var key in slitherMap)
		{
			var point = slitherMap[key];
			context.fillStyle = "#300";
			context.fillRect(point.x,point.y,5,5);
		}
	}
}