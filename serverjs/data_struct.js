var Point = require("./point.js");

function SitherData(binaryData)
{
	var xLoc,yLoc;
	var self = this;
	self.nickname = "";
	self.uid = "";
	self.length = 200;
	self.width = 20;
	self.points = [new Point(xLoc,yLoc-200),new Point(xLoc,yLoc)];
	self.skin = 0;

	self.speed = 90;
	self.direction = (new Point(2,2)).normalize();

	if(binaryData)
	{
		applyBinaryData(binaryData);
	}

	this.toBinary = function()
	{
		return JSON.stringify(self);
	}

	function applyBinaryData(binaryData)
	{
		console.log(JSON.parse(binaryData));
	}
}

module.exports = {"SitherData":SitherData};