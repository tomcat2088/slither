var Point = require("../math.js");
var textureManager = require("./texture_manager.js");
module.exports = function SlitherRender(slither)
{
	var self = this;
	this.slither = slither;
	this.meshes = new Array();
	var img = new Image();
	img.src = "static/circle_mask.png";
	this.update = function(deltaTime,gameRender)
	{
		if(self.slither.dead)
			self.invalid = true;
		var context = gameRender.context;
		var points = self.slither.points;
		drawCirclesOnLine(points,context,self.slither);
		context.lineWidth = 1;
		context.strokeStyle = "#fff";
		firstPt = points[points.length - 1];
		var degree = self.slither.direction.y / self.slither.direction.x;
		context.strokeText(self.slither.nickname + Math.atan(degree)/3.14 * 180,firstPt.x,firstPt.y - 5);
	}


	var caculatePoint = new Point();
	var caculatePointNormalize = new Point();
	var drawPt = new Point();
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
			slither.points[pointSearchIndex + 1].assign(caculatePoint);
			caculatePoint.sub(slither.points[pointSearchIndex],true);

			//delta = caculatePoint
			caculatePoint.assign(caculatePointNormalize);
			caculatePointNormalize.normalize(true);
			var totalLen = caculatePoint.len();

			if(trackedLen + totalLen >= drawLocationLen)
			{
				var offset = drawLocationLen - trackedLen;
				slither.points[pointSearchIndex].assign(drawPt);
				caculatePointNormalize.mul(offset,true);
				drawPt.add(caculatePointNormalize,true);
				drawLocationLen += radius / 2;
				context.drawImage(img,drawPt.x,drawPt.y,radius * 2,radius * 2);
				// context.fillStyle = "#333300";
				// context.fillRect(drawPt.x,drawPt.y,radius * 2,radius * 2);
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