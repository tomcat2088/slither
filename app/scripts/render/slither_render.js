var Point = require("../math.js");
var textureManager = require("./texture_manager.js");
module.exports = function SlitherRender(slither)
{
	var self = this;
	this.slither = slither;
	this.meshes = new Array();
	var img = new Image();
	img.src = "http://127.0.0.1:8080/static/circle_mask.png";
	this.update = function(deltaTime,gameRender)
	{
		var context = gameRender.context;
		var points = self.slither.points;
		drawCirclesOnLine(points,context,slither);

		context.lineWidth = 1;
		firstPt = points[points.length - 1];
		context.strokeText("name",firstPt.x,firstPt.y - 5);
	}

	function drawCirclesOnLine(pts,context,slither)
	{
		var radius = slither.width / 2;
		var count = slither.length / radius;
		for(var index = 0;index < count;index++)
		{
			var distance = radius * index;
			var pt = pointOnLineForDistance(pts,distance);
			context.fillStyle = "#300";
			img.width = radius * 2;
			img.height = radius * 2;
			gameRender.context.drawImage(img,pt.x,pt.y,radius * 2,radius * 2);
		}
	}

	function pointOnLineForDistance(pts,distance)
	{
		var currentDistance = 0;
		for(var index = 0;index < pts.length - 1;index++)
		{
			var lineVec = pts[index + 1].sub(pts[index]).normalize();
			var len = pts[index + 1].sub(pts[index]).len();
			if(currentDistance + len >= distance)
			{
				var pt = pts[index].add(lineVec.mul(distance - currentDistance));
				return pt;
			}
			currentDistance += len;
		}
		return pts[pts.length - 1];
	}
}