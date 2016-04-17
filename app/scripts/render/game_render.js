var textureManager = require("./texture_manager.js")
module.exports = function GameRender(container, size,updateCallBack) {
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


	var ground = new THREE.Mesh(new THREE.PlaneGeometry(size.width, size.height,500,500));
	scene.add(ground);
	textureManager.texture("static/bg.png",function(texture){
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(100,100);
		var material = new THREE.MeshBasicMaterial({
			map:texture
		});
		ground.material = material;
	});


	var self = this;
	this.scene = scene;
	this.registeredRenders = new Array();
	this.registerRender = function(render)
	{
		self.registeredRenders.push(render);
	}

	var lastDate = new Date();

	var stats = new Stats();
	stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild( stats.dom );


	var render = function () {
		requestAnimationFrame( render );
		stats.begin();
		var now = new Date();
		var delta = (now - lastDate);
		lastDate = now;
		for(var key in self.registeredRenders)
		{
			self.registeredRenders[key].update(delta,self);
		}
		if(updateCallBack)
			updateCallBack(delta);

		if(self.focusCallback)
		{
			var cameraPoint = self.focusCallback();
			camera.position.x = cameraPoint.x;
			camera.position.y = cameraPoint.y;
		}

		stats.end();
		renderer.render(scene, camera);
	};
	render();
}
