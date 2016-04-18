var textureManager = require("./texture_manager.js")
var Point = require("../math.js")
module.exports = function GameRender(canvasId,updateCallBack) {
	var self = this;

	var width = window.innerWidth;
	var height = window.innerHeight;
	self.canvas = document.getElementById(canvasId);
	self.context = canvas.getContext('2d');
	canvas.width = width;
	canvas.height = height;

	this.registeredRenders = new Array();
	this.registerRender = function(render)
	{
		self.registeredRenders.push(render);
	}

	var lastDate = new Date();

	//init fps counter
	var stats = new Stats();
	stats.showPanel( 1 );
	document.body.appendChild( stats.dom );


	var render = function () {
		requestAnimationFrame( render );
		stats.begin();
		var now = new Date();
		var delta = (now - lastDate);
		lastDate = now;

		self.context.fillStyle = "#fff";
		self.context.fillRect(0,0,self.canvas.width,self.canvas.height);
		
		var offset = new Point(0,0);
		if(self.focusCallback)
		{
			offset = self.focusCallback();
		}

		self.context.save();
		self.context.translate(-offset.x + self.canvas.width / 2,-offset.y + self.canvas.height / 2);

		self.context.fillStyle = "#f0f";
		self.context.fillRect(0,0,20,20);
		for(var key in self.registeredRenders)
		{
			self.registeredRenders[key].update(delta,self);
		}

		self.context.restore();
		if(updateCallBack)
			updateCallBack(delta,self);

		stats.end();
	};
	render();
}
