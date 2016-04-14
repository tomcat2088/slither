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

	self.normal = function()
	{
		var normalizePt = self.normalize();
		var y = normalizePt.x / Math.sqrt(1 + normalizePt.y * normalizePt.y);
		var x = Math.sqrt(1 - y * y);
		return new Point(x,y);
	}
}