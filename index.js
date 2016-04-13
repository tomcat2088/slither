var game = new Game();
var debugDraw;

window.onload = function()
{
	debugDraw = new DebugDraw(document.getElementById("canvas").getContext('2d'));
	var fps = 30;
	var now;
	var then = Date.now();
	var interval = 1000/fps;
	var delta;
 
	function draw() {
	
		requestAnimationFrame(draw);
	
		now = Date.now();
		delta = now - then;
	
		if (delta > interval) {
			then = now - (delta % interval);
			update(delta/1000);
		}
	}

	draw();
}

function update(deltaTime)
{
	game.update(deltaTime);
}

window.addEventListener('mousemove',function(e){
	direction = new Point(e.clientX - 400,e.clientY - 300);
	direction = direction.normalize();
	game.slither.direction = direction;
});


