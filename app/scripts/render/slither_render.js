module.exports = function SlitherRender(slither)
{
	var self = this;
	this.slither = slither;
	this.meshes = new Array();
	this.update = function(deltaTime,gameRender)
	{
		//if(this.cacheMeshes.length == 0)
		//{
			this.init(gameRender);
		//}
		// self.node.position.x = self.slither.points[0].x;
		// self.node.position.y = self.slither.points[0].y;
	}

	this.init = function(gameRender)
	{
		if(self.meshes.length == 0)
		{
			var count = this.slither.length / (this.slither.width / 2);
			for(var i = 0;i < count;i++)
			{
				var material = new THREE.MeshBasicMaterial({color:0x330000,alphaMap:undefined,transparent: true});
				var circleGeometry = new THREE.PlaneGeometry( self.slither.width,self.slither.width );
				mesh = new THREE.Mesh( circleGeometry, material );
				gameRender.scene.add(mesh);
				self.meshes.push(mesh);
			}
		}
		circleGeometryFromLine(self.slither.points,0,gameRender.scene);
	}

	function circleGeometryFromLine(pts,texture,scene)
	{
		var radius = self.slither.width / 2;
		for(var index = 0;index < self.meshes.length;index++)
		{
			var distance = radius * index;
			var pt = pointOnLineForDistance(pts,distance);
			self.meshes[index].position.x = pt.x;
			self.meshes[index].position.y = pt.y;
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