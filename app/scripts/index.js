// window.onload = function()
// {
// 	window.game = new Game();
// 	window.gameRender = new GameRender(document.body,{width:400,height:400});

// 	window.gameRender.registerRender(new SlitherRender(game.slither));
// }

// window.addEventListener('mousemove',function(e){
// 	direction = new Point(e.clientX - 400,e.clientY - 300);
// 	direction = direction.normalize();
// 	game.slither.direction = direction;
// });

var slither = require("./slither.js");
var slither_o = slither();
console.log(slither_o);