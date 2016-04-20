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
		//drawCirclesOnLine(points,context,slither);
		// context.lineWidth = self.slither.width;
		// context.strokeStyle = self.slither.color;
		// context.lineCap="round";
		// context.beginPath();
		// for(var key in points)
		// {
		// 	if(parseInt(key) == 0)
		// 		context.moveTo(points[key].x,points[key].y);
		// 	else
		// 		context.lineTo(points[key].x,points[key].y);
		// }
		// context.stroke();
		drawCirclesOnLine(points,context,self.slither);
		context.lineWidth = 1;
		firstPt = points[points.length - 1];
		context.strokeText("name",firstPt.x,firstPt.y - 5);
	}

	function drawCirclesOnLine(pts,context,slither)
	{
		var radius = slither.width / 2;
		context.fillStyle = "#300";
		img.width = radius * 2;
		img.height = radius * 2;

		var currentVec;
		var pointSearchIndex = 0;
		var trackedLen = 0;
		var drawLocationLen = 0;

		while(1)
		{
			var delta = slither.points[pointSearchIndex + 1].sub(slither.points[pointSearchIndex]);
			currentVec = delta.normalize();
			var totalLen = delta.len();

			if(trackedLen + totalLen >= drawLocationLen)
			{
				var offset = drawLocationLen - trackedLen;
				var drawPt = slither.points[pointSearchIndex].add(currentVec.mul(offset));
				drawLocationLen += radius / 2;
				context.drawImage(img,drawPt.x,drawPt.y,radius * 2,radius * 2);
			}
			else
			{
				pointSearchIndex ++;
				trackedLen += totalLen;
				if(pointSearchIndex >= pts.length - 1)
				{
					context.drawImage(img,pts[pts.length - 1].x,pts[pts.length - 1].y,radius * 2,radius * 2);
					return;
				}
			}
		}
	}
}