var Point = require("./math.js")
module.exports = function GameRender() {
	var self = this;
	self.isRunning = false;

	this.registeredRenders = new Array();
	this.mappedRenders = new Object();

	this.registeredRender = function(uid)
	{
		return this.mappedRenders[uid];
	}

	this.registerRender = function(render,uid)
	{
		self.registeredRenders.push(render);
		if(uid)
		{
			this.mappedRenders[uid] = render;
		}
	}

	this.unregisterRender = function(uid)
	{
		if(this.mappedRenders[uid])
		{
			this.mappedRenders[uid].invalid = true;
		}
	}

	this.isRenderRegistered = function(uid)
	{
		return this.mappedRenders[uid] != undefined;
	}
}
