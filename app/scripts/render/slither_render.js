function SlitherRender(slither)
{
	var self = this;
	this.slither = slither;
	this.node;
	this.update = function(deltaTime,gameRender)
	{
		if(!this.node)
		{
			this.init(gameRender);
		}
		self.slither.update(deltaTime/1000);
		self.node.position.x = self.slither.points[0].x;
		self.node.position.y = self.slither.points[0].y;
	}

	this.init = function(gameRender)
	{
		var material = new THREE.MeshBasicMaterial({
			color: 0xddd222
		});
		var node = new THREE.Mesh(new THREE.PlaneGeometry(20,20), material);
		gameRender.scene.add(node);
		this.node = node;
	}
}