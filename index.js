var direction = (new Point(2,2)).normalize();
var speed = 50;

var pointArray = new Array();
pointArray.push(new Point(150,50));
pointArray.push(new Point(150,100));
//pointArray.push(new Point(150,150));

var totalLen = 50;
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
		context.fillStyle = "#000";
		context.fillRect(users[uid].data[0].x,users[uid].data[0].y,5,5);
		context.strokeText(""+users[uid].nickname,users[uid].data[0].x,users[uid].data[0].y - 5);
	}
	}
}

setSocketUpdateCallBack(setUsers);

function setUsers(users)
{
	usersState = users;
}

function debugDraw()
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
			pointArr = usersState[key].data;
			for(var indexStr in pointArr)
			{
				index = parseInt(indexStr);
				if(index == 0)
					context.moveTo(pointArr[index].x,pointArr[index].y);
				else
					context.lineTo(pointArr[index].x,pointArr[index].y);
			}
			context.stroke();

			firstPt = usersState[key].data[usersState[key].data.length - 1];
			context.strokeText(""+usersState[key].nickname,firstPt.x,firstPt.y - 5);
		}
	}
	
}

function debugLen()
{
	var totalLen = 0;
	for(var indexStr in pointArray)
	{
		index = parseInt(indexStr);
		if(index >= pointArray.length-1)
			break;
		totalLen+=pointArray[index+1].sub(pointArray[index]).len();
	}
	return (totalLen);
}

// window.addEventListener('mousemove',function(e){
// 	direction = new Point(e.clientX - head().x,e.clientY - head().y);
// 	direction = direction.normalize();
// });

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

function update(deltaTime)
{
	forwardDistance = updateHead(deltaTime);
	updateTail(deltaTime,forwardDistance);
	sendCommand(Command_Sync,pointArray);
	debugDraw();

	if(head().x < 0 || head().x > 800)
		direction.x = -direction.x;
	if(head().y < 0 || head().y > 600)
		direction.y = -direction.y;
}

//Head
function updateHead(deltaTime)
{
	var newPoint = head();
	newPoint = newPoint.add(direction.mul(speed * deltaTime));
	var forwardDistance = speed * deltaTime;
	var len = pointArray.length;
	var oldVec = pointArray[len - 1].sub(pointArray[len - 2]).normalize();
	if(direction.normalize().equal(oldVec))
	{
		head().x = newPoint.x;
		head().y = newPoint.y;
	}
	else
	{
		pointArray.push(newPoint);
	}
	return forwardDistance;
}

function head()
{
	return pointArray[pointArray.length - 1];
}

//Tail
function updateTail(deltaTime,forwardDistance)
{
	var trackedLen = 0;
	for(var index=pointArray.length-1;index >= 1;index--)
	{
		var segmentLen = pointArray[index].sub(pointArray[index-1]).len();
		trackedLen+=segmentLen;
		if(trackedLen >= totalLen)
		{
			//track finish
			var forwardOnThisSeg =  trackedLen - totalLen;
			var overLen = forwardOnThisSeg;
			var vec = pointArray[index].sub(pointArray[index-1]).normalize();
			pointArray[index-1] = pointArray[index-1].add(vec.mul(overLen));
			for(var j=0;j<index-1;j++)
			{
				pointArray.shift();
			}
			return;
		}
	}
}


function Point(x,y)
{
	var self = this;
	self.x = x;
	self.y = y;
	self.add = function(pt)
	{
		return new Point(self.x + pt.x,self.y + pt.y);
	}

	self.sub = function(pt)
	{
		return new Point(self.x - pt.x,self.y - pt.y);
	}

	self.mul = function(val)
	{
		return new Point(self.x * val,self.y * val);
	}

	self.len = function()
	{
		return Math.sqrt(self.x * self.x + self.y*self.y);
	}

	self.normalize = function()
	{
		var len = Math.sqrt(self.x * self.x + self.y*self.y);
		return new Point(self.x / len,self.y / len);
	}

	self.equal = function(pt)
	{
		if(Math.abs(self.x - pt.x) < 0.0001 && Math.abs(self.y - pt.y) < 0.0001)
			return true;
		return false;
	}
}