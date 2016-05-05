var Game = require("./game.js");
var Point = require("./math.js");
var GameRender = require("./render/game_render.js");
var SlitherRender = require("./render/slither_render.js");
var SlitherAI = require("./slither_ai.js");
window.onload = function()
{
	window.gameRender = new GameRender('canvas',function(deltaTime){
		
	});
	window.game = new Game(window.gameRender);

	//game.slitherAIs.push(new SlitherAI(window.gameRender));
}

window.addEventListener('mousemove',function(e){
	if(game.slither == null)
		return;
	direction = new Point(e.clientX - window.innerWidth/2,  e.clientY - window.innerHeight/2);
	direction = direction.normalize();
	game.slither.direction = direction;
});

window.addEventListener('touchmove',function(e){
	e = e.touches[0];
	if(game.slither == null)
		return;
	direction = new Point(e.clientX - window.innerWidth/2,  e.clientY - window.innerHeight/2);
	direction = direction.normalize();
	game.slither.direction = direction;

	e.preventDefault();
});

window.addEventListener('keydown',function(e){
	if(game.slither == null)
		return;
	if(e.keyCode == 32)
	{
		game.slither.speed = 200; 
	}
});

window.addEventListener('keyup',function(e){
	if(game.slither == null)
		return;
	if(e.keyCode == 32)
	{
		game.slither.speed = 100;
	}
});