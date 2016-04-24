var Slither = require("./slither.js");
var SlitherRender = require("./render/slither_render.js");
var GameRender = require("./render/game_render.js");
module.exports = function SlitherAI(gameRender)
{
	var self = this;
	self.slither = new Slither();
	self.slither.color = "#2222ff";
	// self.slither.width = 15;
	self.slither.length = 1000;
	self.slither.speed = 300;
	gameRender.registerRender(new SlitherRender(self.slither));


	var thinkDelay = 5;
	this.update = function(deltaTime)
	{
		thinkDelay -= deltaTime;
		if(thinkDelay <= 0)
		{
			thinkDelay = 5;
			
			var randomDegree = Math.random() * 360;
			self.slither.direction.x = Math.cos(randomDegree / 180.0 * 3.14);
			self.slither.direction.y = Math.sin(randomDegree / 180.0 * 3.14);
		}
		self.slither.update(deltaTime);
	}
}