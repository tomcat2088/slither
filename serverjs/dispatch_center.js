var SlitherClient = require("./slither_client.js");
function DispatchCenter()
{
	var clients = new Object();
	this.addClient = function(websocket)
	{

	}
}

var dispatchCenter = new DispatchCenter();
module.exports = dispatchCenter;