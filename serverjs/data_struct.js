var Point = require("./point.js");

function SitherData(binaryData)
{
	var xLoc = 0,yLoc = 0;
	var self = this;
	self.nickname = "";
	self.uid = "";
	self.length = 500;
	self.width = 20;
	self.skin = 0;

	self.speed = 90;
	self.direction = (new Point(2,2)).normalize();

	if(binaryData)
	{
		applyBinaryData(binaryData);
	}

	initPoints();

	function initPoints()
	{
		self.points = new Array();
		for(var i=self.length-1;i >= 0;i--)
		{
			self.points.push(new Point(0,0 - i * self.width));
		}
	}

	this.toBinary = function()
	{
		return JSON.stringify(self);
	}

	this.exceptPoints = function(transmitPoints)
	{
		var obj = new Object();
		obj.nickname = self.nickname;
		obj.uid = self.uid;
		obj.speed = self.speed;
		obj.direction = self.direction;

		if(transmitPoints)
			obj.points = self.points;
		return obj;
	}

	this.parse = function(data,transmitPoints)
	{
		self.nickname = data.nickname;
		self.uid = data.uid;
		self.speed = data.speed;
		self.direction = data.direction;

		if(transmitPoints)
			self.points = data.points;
		self.width = parseInt(self.length / 60) + 20;
	}

	function applyBinaryData(binaryData)
	{
		console.log(JSON.parse(binaryData));
	}
}

module.exports = {SitherData:SitherData};