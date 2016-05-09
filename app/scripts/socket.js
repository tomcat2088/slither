function Socket(url,protocol)
{
	var self = this;
	self.brSock = null;
	self.nodeSock = null;
	self.nodeConn = null;
	if(typeof WebSocket === 'undefined')
	{
		var NodeSock = require("WebSocket").client;
		self.nodeSock = new NodeSock();
		self.nodeSock.on('connect',function(connection)
		{
			console.log("Connected");
			self.nodeConn = connection;
			if(self.onopen)
			{
				self.onopen('');
			}
			connection.on('message',function(e)
			{
				if(self.onmessage)
				{
					//console.log(e.utf8Data);
					self.onmessage({'data':e.utf8Data});
				}
			});
		});
		self.nodeSock.connect(url,protocol);
	}
	else
	{
		self.brSock = new window.WebSocket(url,protocol);
		self.brSock.onopen = function(e)
		{
			if(self.onopen)
			{
				self.onopen(e);
			}
		}
		self.brSock.onmessage = function(e)
		{
			if(self.onmessage)
			{
				self.onmessage(e);
			}
		}
	}

	self.send = function(message)
	{
		if(self.nodeConn)
		{
			self.nodeConn.sendUTF(message);
		}
		if(self.brSock)
		{
			self.brSock.send(message);
		}
	}
}

module.exports = Socket;