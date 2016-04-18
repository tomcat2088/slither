function DebugDraw(context)
{
	var self = this;
	self.context = context;
	this.drawSlithers = function(slithers,offset)
	{
		var context = self.context;
		context.fillStyle = "#fff";
		context.fillRect(0,0,context.canvas.width,context.canvas.height);
		context.fillStyle = "#81CA84";
		context.fillRect(offset.x - 400,offset.y - 300,context.canvas.width,context.canvas.height);
		context.beginPath();
		context.lineWidth = 1;
		context.strokeStyle = "#330022";
		for(var key in slithers)
		{
			var points = slithers[key].points;
			context.lineWidth = parseInt(slithers[key].width);
			context.strokeStyle = slithers[key].color;
			for(var indexStr in points)
			{
				index = parseInt(indexStr);
				if(index == 0)
					context.moveTo(points[index].x + offset.x,points[index].y + offset.y);
				else
					context.lineTo(points[index].x + offset.x,points[index].y+ offset.y);
			}
			context.stroke();

			context.lineWidth = 1;
			firstPt = points[points.length - 1];
			context.strokeText("name",firstPt.x + offset.x,firstPt.y + offset.y - 5);
		}
	}

	this.drawMap = function(slitherMap,offset)
	{
		var context = self.context;
		//context.fillStyle = "#fff";
		//context.fillRect(0,0,context.canvas.width,context.canvas.height);
		for(var key in slitherMap)
		{
			var point = slitherMap[key];
			context.fillStyle = "#300";
			context.fillRect(point.x + offset.x - 400,point.y + offset.y - 300,5,5);
		}
	}

}