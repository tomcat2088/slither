var command = require("./commands.js");
var SlitherClient = require("./slither_client.js");

function DispatchCenter()
{
	var self = this;

	var clients = new Object();
	this.addClient = function(connection)
	{
		var client = new SlitherClient(connection,self);
		console.log((new Date()) + ' Client Created ==> ' + client.uid);
		clients[client.uid] = client;

	    connection.on('close', function(reasonCode, description) {
	        delete clients[client.uid];
	        for(var key in clients)
	        {
	        	clients[key].send(command.Logout,client.uid);
	        }
	    });
	}

	this.dispatch = function(command,data,exceptList)
	{
		for(var key in clients)
		{
			if(exceptList && exceptList.indexOf(key) >= 0)
			{
				continue;
			}
			clients[key].send(command,data);
		}
	}

	this.close = function(uid)
	{
		if(clients[uid])
		{
			clients[uid].connection.close();
			delete clients[uid];
		}
	}
}

var dispatchCenter = new DispatchCenter();

module.exports = dispatchCenter;