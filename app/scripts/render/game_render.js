var textureManager = require("./texture_manager.js")
var Point = require("../math.js")
module.exports = function GameRender(canvasId,updateCallBack) {
	var self = this;
	self.isRunning = false;

	var width = window.innerWidth;
	var height = window.innerHeight;
	self.canvas = document.getElementById(canvasId);
	self.context = canvas.getContext('2d');
	canvas.width = width;
	canvas.height = height;

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

	var lastDate = new Date();

	//init fps counter
	var stats = new Stats();
	stats.showPanel( 1 );
	document.body.appendChild( stats.dom );


	var render = function () {
		requestAnimationFrame( render );
		if(self.isRunning == false)
			return;

		stats.begin();
		var now = new Date();
		var delta = (now - lastDate);
		lastDate = now;

		self.context.fillStyle = "#333333";
		self.context.fillRect(0,0,self.canvas.width,self.canvas.height);
		
		var offset = new Point(0,0);
		if(self.focusCallback)
		{
			offset = self.focusCallback();
		}

		self.context.save();
		self.context.translate(-offset.x + self.canvas.width / 2,-offset.y + self.canvas.height / 2);

		self.context.strokeStyle = "#888888";
		self.context.beginPath();
		var mapLength = 10000;
		for(var x = -mapLength;x < mapLength;x += 50)
		{
			self.context.moveTo(x,-mapLength);
			self.context.lineTo(x,mapLength);
		}
		
		for(var y = -mapLength;y < mapLength;y += 50)
		{
			self.context.moveTo(-mapLength,y);
			self.context.lineTo(mapLength,y);
		}

		self.context.stroke();


		self.context.fillStyle = "#f0f";
		self.context.fillRect(0,0,20,20);
		for(var key in self.registeredRenders)
		{
			if(self.registeredRenders[key].invalid)
				delete self.registeredRenders[key];
			else
				self.registeredRenders[key].update(delta,self);
		}

		self.context.restore();
		if(updateCallBack)
			updateCallBack(delta,self);

		stats.end();
	};
	render();
}
