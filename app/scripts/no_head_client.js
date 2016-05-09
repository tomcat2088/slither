var Game = require("./game.js");
var Point = require("./math.js");
var GameRender = require("./dummy_render.js");
var SlitherAI = require("./slither_ai.js");
GLOBAL.window = GLOBAL;

var ai = null;
window.gameRender = new GameRender();
window.game = new Game(window.gameRender);
window.game.slitherCreated = function()
{
	ai = new SlitherAI(null,window.game.slither);
}

window.game.updateCallback = function(deltaTime)
{
	if(ai)
	{
		ai.update(deltaTime);
	}
}