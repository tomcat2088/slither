var Game = require("./game.js");
var Point = require("./math.js");
var GameRender = require("./render/game_render.js");
var SlitherRender = require("./render/slither_render.js");
window.onload = function()
{
	window.game = new Game();
	window.gameRender = new GameRender(document.body,{width:2000,height:2000},function(deltaTime){
		window.game.update(deltaTime);
	});

	window.gameRender.registerRender(new SlitherRender(game.slither));
	window.gameRender.focusCallback = function()
	{
		var pt = game.slither.points[game.slither.points.length - 1];
		return pt;
	}
}

window.addEventListener('mousemove',function(e){
	direction = new Point(e.clientX - window.innerWidth/2, - e.clientY + window.innerHeight/2);
	direction = direction.normalize();
	game.slither.direction = direction;
});