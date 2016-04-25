var Game = require("./game.js");
var Point = require("./math.js");
var GameRender = require("./render/game_render.js");
var SlitherRender = require("./render/slither_render.js");
var SlitherAI = require("./slither_ai.js");
window.onload = function()
{
	window.game = new Game();
	window.gameRender = new GameRender('canvas',function(deltaTime){
		
	});
	setInterval(function(){
		window.game.update(1000/30);
	}, 1000/30);

	window.gameRender.registerRender(new SlitherRender(game.slither));
	window.gameRender.focusCallback = function()
	{
		var pt = game.slither.points[game.slither.points.length - 1];
		return pt;
	}

	game.slitherAIs.push(new SlitherAI(window.gameRender));
}

window.addEventListener('mousemove',function(e){
	direction = new Point(e.clientX - window.innerWidth/2,  e.clientY - window.innerHeight/2);
	direction = direction.normalize();
	game.slither.direction = direction;
});

window.addEventListener('keydown',function(e){
	if(e.keyCode == 32)
	{
		game.slither.speed = 200; 
	}
});

window.addEventListener('keyup',function(e){
	if(e.keyCode == 32)
	{
		game.slither.speed = 100;
	}
});