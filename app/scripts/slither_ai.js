var Slither = require("./slither.js");
var SlitherRender = require("./render/slither_render.js");
var GameRender = require("./render/game_render.js");
var Point = require("./math.js");
module.exports = function SlitherAI(gameRender)
{
	var self = this;
	self.slither = new Slither(200,100);
	self.slither.color = "#2222ff";
	// self.slither.width = 15;
	self.slither.length = 300;
	self.slither.speed = 170;
	gameRender.registerRender(new SlitherRender(self.slither));


	var thinkDelay = 1;
	var targetFoodUid;

	this.update = function(deltaTime)
	{
		thinkDelay -= deltaTime;
		if(thinkDelay <= 0)
		{
			thinkDelay = 1;

			nearestFood();

			if(window.game.slitherMap[targetFoodUid])
			{
				var food = window.game.slitherMap[targetFoodUid];
				self.slither.direction.x = food.x - self.slither.points[self.slither.points.length - 1].x;
				self.slither.direction.y = food.y - self.slither.points[self.slither.points.length - 1].y;
				self.slither.direction.normalize(true);
			}
		}
		self.slither.update(deltaTime);
	}


	var nearestFoodPoint = new Point();
	function nearestFood()
	{
		var foods = window.game.slitherMap;
		
		var distance = 100000000;
		for(var key in foods)
		{
			nearestFoodPoint.x = foods[key].x;
			nearestFoodPoint.y = foods[key].y;
			nearestFoodPoint.sub(self.slither.points[self.slither.points.length - 1],true);
			var newLen = nearestFoodPoint.len();
			if(newLen < distance)
			{
				distance = newLen;
				targetFoodUid = key;
			}
		}
	}
}