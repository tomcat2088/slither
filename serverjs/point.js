var xVec = new Point(1,0);
function Point(x,y)
{
	var self = this;
	self.x = x;
	self.y = y;
	self.assign = function(target)
	{
		target.x = self.x;
		target.y = self.y;
	}

	

	self.add = function(pt,addToSelf)
	{
		if(addToSelf)
		{
			self.x += pt.x;
			self.y += pt.y;
		}
		else
			return new Point(self.x + pt.x,self.y + pt.y);
	}

	self.sub = function(pt,addToSelf)
	{		
		if(addToSelf)
		{
			self.x -= pt.x;
			self.y -= pt.y;
		}
		else
			return new Point(self.x - pt.x,self.y - pt.y);
	}

	self.mul = function(val,addToSelf)
	{
		if(addToSelf)
		{
			self.x *= val;
			self.y *= val;
		}
		else
			return new Point(self.x * val,self.y * val);
	}

	self.len = function()
	{
		return Math.sqrt(self.x * self.x + self.y*self.y);
	}

	self.normalize = function(addToSelf)
	{
		var len = Math.sqrt(self.x * self.x + self.y*self.y);
		if(addToSelf)
		{
			self.x /= len;
			self.y /= len;
		}
		else
			return new Point(self.x / len,self.y / len);
	}

	self.equal = function(pt)
	{
		if(self.x == pt.x && self.y == pt.y)
			return true;
		return false;
	}

	self.normal = function(addToSelf)
	{
		var len = Math.sqrt(self.x * self.x + self.y*self.y);
		var normalizePtX = self.x / len;
		var normalizePtY = self.y / len;
		var y = normalizePtX / Math.sqrt(1 + normalizePtY * normalizePtY);
		var x = Math.sqrt(1 - y * y);

		if(addToSelf)
		{
			self.x = x;
			self.y = y;
		}
		else
			return new Point(x,y);
	}

	self.rotate = function(fromVec,toVec,addToSelf)
	{
		//fromVec x,y
		//toVec x',y'
		var sin = (fromVec.x * toVec.y - fromVec.y * toVec.x) / (fromVec.x * fromVec.x + fromVec.y * fromVec.y);
		var cos = 0;
		if(fromVec.x == 0)
			cos = 0;
		else
			cos = toVec.x/fromVec.x + fromVec.y/fromVec.x * sin;

		var newX = self.x * cos - self.y * sin;
		var newY = self.x * sin + self.y * cos;

		if(addToSelf)
		{
			self.x = newX;
			self.y = newY;
			return;
		}
		return new Point(newX,newY);
	}

	self.pointToLineDistance = function(pt,lineBegin,lineEnd)
	{
		pt.x -= lineBegin.x;
		pt.y -= lineBegin.y;
		lineEnd.x -= lineBegin.x;
		lineEnd.y -= lineBegin.y;
		lineBegin.x = 0;
		lineBegin.y = 0;

		var len = lineEnd.len();
		lineEnd.normalize(true);
		pt.rotate(lineEnd,xVec,true);
		if(pt.x >=0 && pt.x <= len)
			return Math.abs(pt.y);
		return -1;
	}
}
module.exports = Point;