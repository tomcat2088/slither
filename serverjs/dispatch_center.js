var SlitherClient = require("./slither_client.js");
function DispatchCenter()
{
	var clients = new Object();
	this.addClient = function(connection)
	{
		var client = new SlitherClient();
		console.log((new Date()) + ' Client Created ==> ' + client.uid);
		clients[client.uid] = client;

		connection.on('message', function(message) {
	        if (message.type === 'utf8') {
	            client.processMessage(message.utf8Data);
	        }
	    });
	    connection.on('close', function(reasonCode, description) {
	        
	    });
	}
}

var dispatchCenter = new DispatchCenter();
module.exports = dispatchCenter;