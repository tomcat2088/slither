function Slither()
{
	var self = this;
	self.length = 50;
	self.width = Math.random() * 10;
	self.points = [new Point(100,100),new Point(100,90)];
	self.color = '#c32000';

	self.speed = 80;
	self.direction = (new Point(2,2)).normalize();

	this.serialize = function()
	{
		var obj = new Object();
		obj.length = self.length;
		obj.width = self.width;
		obj.points = self.points;
		obj.color = self.color;
		return obj;
	}

	this.deserialize = function(dataStr)
	{
		var obj = JSON.parse(dataStr);
		self.length = obj.length;
		self.width = obj.width;
		self.points = obj.points;
		self.color = obj.color;
	}

	this.update = function(deltaTime)
	{
		forwardDistance = updateHead(deltaTime);
		updateTail(deltaTime,forwardDistance);

		// if(head().x < 0 || head().x > 800)
		// 	self.direction.x = -self.direction.x;
		// if(head().y < 0 || head().y > 600)
		// 	self.direction.y = -self.direction.y;

		self.length += 10 * deltaTime;
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

	//Tail
	function updateTail(deltaTime,forwardDistance)
	{
		var trackedLen = 0;
		for(var index=self.points.length-1;index >= 1;index--)
		{
			var segmentLen = self.points[index].sub(self.points[index-1]).len();
			trackedLen+=segmentLen;
			if(trackedLen >= self.length)
			{
				//track finish
				var forwardOnThisSeg =  trackedLen - self.length;
				var overLen = forwardOnThisSeg;
				var vec = self.points[index].sub(self.points[index-1]).normalize();
				self.points[index-1] = self.points[index-1].add(vec.mul(overLen));
				for(var j=0;j<index-1;j++)
				{
					self.points.shift();
				}
				return;
			}
		}
	}

}