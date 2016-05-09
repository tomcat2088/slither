var uuid = require("./uuid.js");
var Commands = require("./commands.js");
var SlitherData = require("./data_struct.js").SitherData;
var slitherMap = require("./slither_map.js");
module.exports = function SlitherClient(connection,dispatcher)
{
	var self = this;
	
	self.uid = uuid();
	self.connection = connection;
	self.dispatcher = dispatcher;
	connection.on('message', function(message) {
		if (message.type === 'utf8') {
			var obj = JSON.parse(message.utf8Data);
		    self.receive(obj.command,obj.data);
		}
	});

	self.slither = null;

	self.receive = function(command,data)
	{
		switch(command)
		{
			case Commands.Login:
				self.login(data);
				break;
			case Commands.SyncSlither:
				self.sync(data);
				break;
			case Commands.Map:
				self.sendMap();
				break;
			case Commands.EatFood:
				self.eatFood(data);
				break;
			case Commands.Kill:
				self.kill(data);
				break;
			case Commands.SyncSlitherExceptPoints:
				self.syncExceptPoints(data);
				break;
		}
	}

	self.send = function(command,data)
	{
		self.connection.send(JSON.stringify({command:command,code:0,data:data}));
	}

	self.sendError = function(command,data)
	{
		self.connection.send(JSON.stringify({command:command,code:-1,data:data}));
	}


	self.login = function(data)
	{
		console.log("Begin login >>");
		self.slither = new SlitherData();
		self.slither.nickname = data.nickname;
		self.slither.uid = self.uid;

		console.log("Slither Created >>");
		self.send(Commands.Login,self.slither);
	}

	self.sync = function(data)
	{
		self.slither.parse(data,true);
		self.dispatcher.dispatch(Commands.SyncSlither,self.slither);
	}

	self.syncExceptPoints = function(data)
	{
		self.slither.parse(data,false);
		self.dispatcher.dispatch(Commands.SyncSlitherExceptPoints,self.slither.exceptPoints());
	}

	self.sendMap = function()
	{
		console.log("Send Map >>");
		self.send(Commands.Map,slitherMap.units);
	}

	self.eatFood = function(data)
	{
		console.log("EatFood >>");
		var food = slitherMap.units[data];
		if(food)
		{
			self.slither.length += food.size;
			self.send(Commands.SyncSlither,self.slither);
		}

		self.dispatcher.dispatch(Commands.EatFood,data);
	}

	self.kill = function(data)
	{
		console.log(self.slither.uid + " Kill >>>" + data);
		self.dispatcher.dispatch(Commands.Kill,data);

		var killedClient = self.dispatcher.client(data);
		if(!killedClient)
			return;
		var foods = killedClient.becomeFood();
		for(var key in foods)
		{
			slitherMap.units[key] = foods[key];
		}

		self.dispatcher.dispatch(Commands.Map,slitherMap.units);
		self.dispatcher.close(data);
	}

	self.becomeFood = function()
	{
		var i=0;
		var units = new Object();
		console.log(self.slither);
		for(var key in self.slither.points)
		{
			var pt = self.slither.points[key];
			var uid = uuid() + i;
			units[uid] = {x:pt.x,y:pt.y,uid:uid,size:3};
			i++;
		}

		return units;
	}
}