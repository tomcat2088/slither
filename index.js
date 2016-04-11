var direction = new Point(0,1);
var speed = 10;

var pointArray = new Array();
pointArray.push(new Point(0,20));
pointArray.push(new Point(0,0));

function debugDraw()
{
	var context = document.getElementById("canvas").getContext('2d');
	context.clearRect(0,0,context.canvas.width,context.canvas.height);
	for(var indexStr in pointArray)
	{
		index = parseInt(indexStr);
		if(index == 0)
			context.moveTo(pointArray[index].x,pointArray[index].y);
		else
			context.moveTo(pointArray[index].x,pointArray[index].y);
	}
}

function update(deltaTime)
{
	forwardDistance = updateHead(deltaTime);
	updateTail(deltaTime,forwardDistance);
	debugDraw();
}

//Head
function updateHead(deltaTime)
{
	var newPoint = head();
	newPoint = newPoint.add(direction.mul(speed * deltaTime));
	var forwardDistance = direction.mul(speed * deltaTime).len();
	var oldVec = pointArray[0].sub(pointArray[1]).normalize();
	if(direction.equal(oldVec))
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
	for(var indexStr in pointArray)
	{
		index = parseInt(indexStr);
		var segmentLen = pointArray[index+1].sub(pointArray[index]).len();
		trackedLen+=segmentLen;
		if(trackedLen >= forwardDistance)
		{
			//track finish
			var forwardOnThisSeg =  forwardDistance - (trackedLen - segmentLen);
			var overLen = forwardOnThisSeg;
			var vec = pointArray[index+1].sub(pointArray[index]).normalize();
			pointArray[index] = pointArray[index].add(vec.mul(overLen));
			return;
		}
		else
		{
			pointArray.shift();
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