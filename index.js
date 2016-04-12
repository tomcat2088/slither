


var usersState;

function debugDrawUsers()
{
	if(usersState)
	{
		users = usersState;
		var context = document.getElementById("canvas").getContext('2d');
		context.fillStyle = "#fff";
		context.fillRect(0,0,context.canvas.width,context.canvas.height);
		for(var uid in users)
		{
			var points = users[uid].data['points'];
			context.fillStyle = users[uid].data['color'];

			context.fillRect(points[0].x,points[0].y,5,5);
			context.strokeText(""+uid,points[0].x,points[0].y - 5);
		}
	}
}

setSocketUpdateCallBack(setUsers);

function setUsers(users)
{
	usersState = users;
}

function debugDraw(offset)
{
	if(usersState)
	{
		var context = document.getElementById("canvas").getContext('2d');
		context.fillStyle = "#fff";
		context.fillRect(0,0,context.canvas.width,context.canvas.height);
		context.beginPath();
		context.lineWidth = 1;
		context.strokeStyle = "#330022";
		for(var key in usersState)
		{
			var points = usersState[key].data['points'];
			context.lineWidth = parseInt(usersState[key].data['width']);
			context.strokeStyle = usersState[key].data['color'];
			for(var indexStr in points)
			{
				index = parseInt(indexStr);
				if(index == 0)
					context.moveTo(points[index].x + offset.x,points[index].y + offset.y);
				else
					context.lineTo(points[index].x+ offset.x,points[index].y+ offset.y);
			}
			context.stroke();

			firstPt = points[points.length - 1];
			context.strokeText("",firstPt.x,firstPt.y - 5);
		}
	}
	
}

window.onload = function()
{
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

var slither = new Slither();

function update(deltaTime)
{
	slither.update(deltaTime);
	sendCommand(Command_Sync,slither.serialize());
	pt = slither.points[slither.points.length - 1];
	debugDraw({x:400 - pt.x,y:300 - pt.y});
}

window.addEventListener('mousemove',function(e){
	direction = new Point(e.clientX - 400,e.clientY - 300);
	direction = direction.normalize();
	slither.direction = direction;
});


