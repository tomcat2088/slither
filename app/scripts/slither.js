var Point = require("./math.js");

module.exports = function Slither(xLoc,yLoc,data)
{
	if(!xLoc)
		xLoc = 0;
	if(!yLoc)
		yLoc = 0;
	var self = this;
	self.nickname = "";
	self.uid = "";
	self.length = 200;
	self.width = 20;
	self.points = [new Point(xLoc,yLoc-200),new Point(xLoc,yLoc)];
	self.color = '#ff3300';

	self.speed = 90;
	self.direction = (new Point(2,2)).normalize();

	self.turnToDirection = function(direction)
	{
		self.targetDegree = self.directionToDegree(direction);
	}

	self.degreeToDirection = function(degree)
	{
		self.direction.x = Math.cos(degree / 180 * 3.14);
		self.direction.y = -Math.sin(degree / 180 * 3.14);
		return self.direction;
	}

	self.directionToDegree = function(direction)
	{
		var atan = direction.y / direction.x;
		var degree = Math.atan(atan)/3.14 * 180;
		var x = direction.x;
		var y = direction.y;
		if(x > 0)
		{
			if(y <= 0)
			{
				degree = -degree;
			}
			else
			{
				degree = 360 - degree;
			}
		}
		else
		{
			if(y <= 0)
			{
				degree = 180 - degree;
			}
			else
			{
				degree = 180 - degree;
			}
		}
		return degree;
	}

	self.targetDegree = self.directionToDegree(self.direction);

	this.updateDirection = function(deltaTime)
	{
		var nowDegree = self.directionToDegree(self.direction);
		if(Math.abs(self.targetDegree - nowDegree) > 0.0000001)
		{
			nowDegree += (self.targetDegree - nowDegree) / 4;
		}
		self.direction = self.degreeToDirection(nowDegree);
	}

	this.serialize = function()
	{
		var obj = new Object();
		obj.length = self.length;
		obj.width = self.width;
		obj.points = self.points;
		obj.color = self.color;
		return obj;
	}

	this.deserialize = function(obj)
	{
		self.length = obj.length;
		self.width = obj.width;
		self.points = new Array();
		for(var key in obj.points)
		{
			self.points.push(new Point(obj.points[key].x,obj.points[key].y));
		}
		self.uid = obj.uid;
		self.nickname = obj.nickname;
		self.color = obj.color;
	}

	this.update = function(deltaTime)
	{
		//this.updateDirection(deltaTime);
		forwardDistance = updateHead(deltaTime);
		updateTail(deltaTime,forwardDistance);
	}

	var dieTestHead = new Point();
	var dieTestLineBegin = new Point();
	var dieTestLineEnd = new Point();
	this.dieTest = function(slither)
	{
		for(var i = 0;i < slither.points.length - 1;i++)
		{
			head().assign(dieTestHead);
			slither.points[i].assign(dieTestLineBegin);
			slither.points[i + 1].assign(dieTestLineEnd);

			var distance = dieTestHead.pointToLineDistance(dieTestHead,dieTestLineBegin,dieTestLineEnd);
			if(distance >=0 && distance < slither.width / 2 + self.width / 2)
			{
				//i die
				return self;
			}
		}

		for(var i = 0;i < self.points.length - 1;i++)
		{
			slither.points[slither.points.length - 1].assign(dieTestHead);
			self.points[i].assign(dieTestLineBegin);
			self.points[i + 1].assign(dieTestLineEnd);
			var distance = dieTestHead.pointToLineDistance(dieTestHead,dieTestLineBegin,dieTestLineEnd);
			if(distance >=0 && distance < slither.width / 2 + self.width / 2)
			{
				//u die
				return slither;
			}
		}
	}

	this.die = function()
	{
		self.dead = true;
	}

	//Head
	function updateHead(deltaTime)
	{
		var newPoint = head();
		newPoint = newPoint.add(self.direction.mul(self.speed * deltaTime));
		var forwardDistance = self.speed * deltaTime;
		var len = self.points.length;
		var oldVec = self.points[len - 1].sub(self.points[len - 2]).normalize();
		if(self.direction.normalize().equal(oldVec))
		{
			head().x = newPoint.x;
			head().y = newPoint.y;
		}
		else
		{
			self.points.push(newPoint);
		}
		return forwardDistance;
	}

	function head()
	{
		return self.points[self.points.length - 1];
	}

	var caculatePoint = new Point();
	//Tail
	function updateTail(deltaTime,forwardDistance)
	{
		var trackedLen = 0;
		for(var index=self.points.length-1;index >= 1;index--)
		{
			self.points[index].assign(caculatePoint);
			caculatePoint.sub(self.points[index-1],true);
			var segmentLen = caculatePoint.len();
			trackedLen+=segmentLen;
			if(trackedLen >= self.length)
			{
				//track finish
				var forwardOnThisSeg =  trackedLen - self.length;
				var overLen = forwardOnThisSeg;
				self.points[index-1].add(caculatePoint.mul(overLen / segmentLen),true);
				for(var j=0;j<index-1;j++)
				{
					self.points.shift();
				}
				return;
			}
		}
	}

}