module.exports = function Point(x,y)
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
}