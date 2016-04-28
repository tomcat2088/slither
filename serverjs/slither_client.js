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

	var slither;

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
		slither = new SlitherData();
		slither.nickname = data.nickname;
		slither.uid = self.uid;

		console.log("Slither Created >>");
		self.dispatcher.dispatch(Commands.Login,slither);
	}

	self.sync = function(data)
	{
		slither.parse(data);
		self.dispatcher.dispatch(Commands.SyncSlither,slither);
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
			slither.length += food.size / 10;
			self.send(Commands.SyncSlither,slither);
		}

		self.dispatcher.dispatch(Commands.EatFood,data);
	}

	self.kill = function(data)
	{
		console.log(slither.uid + " Kill >>>" + data);
		self.dispatcher.dispatch(Commands.Kill,data);
		self.dispatcher.dispatch(Commands.Map,slitherMap.units);

		var killedClient = self.dispatcher.client(data);
		var foods = killedClient.becomeFood();
		for(var key in foods)
		{
			slitherMap.units[key] = foods[key];
		}

		self.dispatcher.close(data);
	}

	self.becomeFood = function()
	{
		for(var pt in slither.points)
		{
			var uid = uuid() + "" + i;
			self.units[uid] = {x:x,y:y,uid:uid,size:size};
		}
	}
}