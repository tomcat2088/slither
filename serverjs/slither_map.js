var uuid = require("./uuid.js");
function SlitherMap()
{
	var self = this;
	self.units = new Object();

	self.genMap = function(width,height,count)
	{
		for(var i = 0; i < count; i++)
		{
			var x = Math.random() * width * 2 - Math.random() * width;
			var y = Math.random() * height * 2 - Math.random() * height;
			var uid = uuid() + "" + i;
			var size = Math.random() * 15 + 5;
			self.units[uid] = {x:x,y:y,uid:uid,size:size};
		}
	}

	self.remove = function(uid)
	{
		delete self.units[uid];
	}
}

var slitherMap = new SlitherMap();
slitherMap.genMap(1000,1000,200);
module.exports = slitherMap;