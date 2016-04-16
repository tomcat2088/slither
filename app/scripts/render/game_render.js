function GameRender(container, size) {
	var scene = new THREE.Scene();
	var width = window.innerWidth;
	var height = window.innerHeight;
	var camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	if (container)
		container.appendChild(renderer.domElement);
	else
		document.body.appendChild(renderer.domElement);

	camera.position.z = 999;

	var material = new THREE.MeshBasicMaterial({
		color: 0xdddddd
	});
	var ground = new THREE.Mesh(new THREE.PlaneGeometry(size.width, size.height), material);
	scene.add(ground);

	var self = this;
	this.scene = scene;
	this.registeredRenders = new Array();
	this.registerRender = function(render)
	{
		self.registeredRenders.push(render);
	}

	var lastDate = new Date();
	var render = function () {
		requestAnimationFrame( render );
		var now = new Date();
		var delta = (now - lastDate);
		lastDate = now;
		for(var key in self.registeredRenders)
		{
			self.registeredRenders[key].update(delta,self);
		}
		renderer.render(scene, camera);
	};
	render();
}
