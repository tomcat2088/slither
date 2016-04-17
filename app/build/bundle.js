(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Slither = require("./slither.js");
var Server = require("./server.js");
module.exports = function Game()
{
	var self = this;
	var loginUser = null;

	self.slither = new Slither(); //self
	self.otherSlithers = new Object();//other player's slithers

	self.slitherMap = new Array();
	this.server = new Server("",function(command,obj){
		if(command == self.server.Server_Command_Login)
		{
			loginUser = obj.data;
			self.server.loadMap();
		}
		else if(command == self.server.ServerServer_Command_Sync)
		{
			self.otherSlithers[obj.uid] = obj.data;
		}
		else if(command == self.server.Server_Command_Map)
		{
			self.slitherMap = obj.data;
		}
		else if(command == self.server.Server_Command_CatchProp)
		{
			delete self.slitherMap[obj.data.uid];
		}
		else if(command == self.server.Server_Command_Logout)
		{
			delete self.otherSlithers[obj.uid];
		}
	});
	this.server.login("ocean");

	this.update = function(deltaTime)
	{
		deltaTime /= 1000;

		self.slither.update(deltaTime);
		//self.server.sync(self.slither.serialize());

		var lastPt = self.slither.points[self.slither.points.length - 1];

		for(var prop in self.slitherMap)
		{

		}
	};
}
},{"./server.js":7,"./slither.js":8}],2:[function(require,module,exports){
var Game = require("./game.js");
var Point = require("./math.js");
var GameRender = require("./render/game_render.js");
var SlitherRender = require("./render/slither_render.js");
window.onload = function()
{
	window.game = new Game();
	window.gameRender = new GameRender(document.body,{width:2000,height:2000},function(deltaTime){
		window.game.update(deltaTime);
	});

	window.gameRender.registerRender(new SlitherRender(game.slither));
	window.gameRender.focusCallback = function()
	{
		var pt = game.slither.points[game.slither.points.length - 1];
		return pt;
	}
}

window.addEventListener('mousemove',function(e){
	direction = new Point(e.clientX - window.innerWidth/2, - e.clientY + window.innerHeight/2);
	direction = direction.normalize();
	game.slither.direction = direction;
});
},{"./game.js":1,"./math.js":3,"./render/game_render.js":4,"./render/slither_render.js":5}],3:[function(require,module,exports){
module.exports = function Point(x,y)
{
	var self = this;
	self.x = x;
	self.y = y;
	self.add = function(pt)
	{
		return new Point(self.x + pt.x,self.y + pt.y);
	}

	self.sub = function(pt)
	{
		return new Point(self.x - pt.x,self.y - pt.y);
	}

	self.mul = function(val)
	{
		return new Point(self.x * val,self.y * val);
	}

	self.len = function()
	{
		return Math.sqrt(self.x * self.x + self.y*self.y);
	}

	self.normalize = function()
	{
		var len = Math.sqrt(self.x * self.x + self.y*self.y);
		return new Point(self.x / len,self.y / len);
	}

	self.equal = function(pt)
	{
		if(Math.abs(self.x - pt.x) < 0.0001 && Math.abs(self.y - pt.y) < 0.0001)
			return true;
		return false;
	}

	self.normal = function()
	{
		var normalizePt = self.normalize();
		var y = normalizePt.x / Math.sqrt(1 + normalizePt.y * normalizePt.y);
		var x = Math.sqrt(1 - y * y);
		return new Point(x,y);
	}
}
},{}],4:[function(require,module,exports){
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

},{"./texture_manager.js":6}],5:[function(require,module,exports){
var Point = require("../math.js");
var textureManager = require("./texture_manager.js");
module.exports = function SlitherRender(slither)
{
	var self = this;
	this.slither = slither;
	this.meshes = new Array();
	this.update = function(deltaTime,gameRender)
	{
		this.init(gameRender);
	}

	this.init = function(gameRender)
	{
		if(self.meshes.length == 0)
		{
			var count = this.slither.length / (this.slither.width / 2);
			for(var i = 0;i < count;i++)
			{
				var material = new THREE.MeshBasicMaterial({color:0x330000});
				var circleGeometry = new THREE.PlaneGeometry( self.slither.width,self.slither.width );
				mesh = new THREE.Mesh( circleGeometry, material );
				gameRender.scene.add(mesh);
				self.meshes.push(mesh);
			}

			textureManager.texture("static/circle_mask.png",function(texture){
			console.log(texture);
			for(var key in self.meshes)
			{
				var material = new THREE.MeshBasicMaterial({color:0x330000,alphaMap:texture,transparent: true});
				self.meshes[key].material = material;
			}
		});
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
		// return new Point(0,0);
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
},{"../math.js":3,"./texture_manager.js":6}],6:[function(require,module,exports){
function TextureManager()
{
	var self = this;
	var loader = new THREE.TextureLoader();
	self.cachedTexture = new Object();
	this.texture = function(url,callback)
	{
		if(self.cachedTexture[url])
		{
			if(callback)
				callback(self.cachedTexture[url])
			return;
		}
		loader.load(
			// resource URL
			url,
			// Function when resource is loaded
			function ( texture ) {
				if(callback)
				{
					callback(texture);
				}
			}
		);
	}
}

var manager = new TextureManager();
module.exports = manager;
},{}],7:[function(require,module,exports){
module.exports = function Server(serverUrl,commandCallBack)
{
	var self = this;

	self.Server_Command_Login = 10000;
	self.Server_Command_Sync = 10001;
	self.Server_Command_Message = 10002;
	self.Server_Command_Logout = 10003;
	self.Server_Command_Map = 10004;
	self.Server_Command_CatchProp = 10005;

	self.commandCallBack = commandCallBack;

	self.avaliable = false;
	self.loginUser = null;

	var websocket;
	this.login = function(nickname)
	{
		if(websocket)
			return;
		websocket = new WebSocket("ws://localhost:8765");//serverUrl
		websocket.onopen = function(e)
		{
			console.log("Connect success!!! Begin login...");
			sendCommand(self.Server_Command_Login,{'nickname':nickname});
		}
		websocket.onmessage = function(e)
		{
			var obj = JSON.parse(e.data);
			processResponse(obj);
		}
	}

	this.sync = function(data)
	{
		sendCommand(self.Server_Command_Sync,data);	
	}

	this.loadMap = function()
	{
		sendCommand(self.Server_Command_Map,"");	
	}

	this.catchProp = function(uid)
	{
		sendCommand(self.Server_Command_CatchProp,uid);	
	}

	//process response
	function loginResponse(obj)
	{
		console.log("Login Success > " + obj.data.uid);
		self.loginUser = obj.data;
		if(self.commandCallBack)
		{
			self.commandCallBack(self.Server_Command_Login,obj);
		}
	}

	function syncResponse(obj)
	{
		if(self.commandCallBack)
		{
			self.commandCallBack(self.Server_Command_Sync,obj);
		}
	}

	function logoutResponse(obj)
	{
		if(self.commandCallBack)
		{
			self.commandCallBack(self.Server_Command_Logout,obj);
		}
	}

	function responseProcessMap()
	{
		return {10000:loginResponse,
				10001:syncResponse,
				10003:logoutResponse};
	}

	function processResponse(obj)
	{
		if(obj.code != 0)
		{
			console.log("error:" + obj.data);
			return;
		}
		else
		{
			var func = responseProcessMap()[obj.command];
			if(func)
			{
				func(obj);
			}
			else
			{
				if(self.commandCallBack)
				{
					self.commandCallBack(obj.command,obj);
				}
			}
		}
	}

	function sendCommand(command,data)
	{
		if(websocket == null)
			return;
		var result = new Object();
		if(command != self.Server_Command_Login)
			if(self.loginUser)
				result.uid = self.loginUser.uid;
			else
				return
		result.command = command;
		result.data = data;
		websocket.send(JSON.stringify(result));
	}
}

},{}],8:[function(require,module,exports){
var Point = require("./math.js");

module.exports = function Slither()
{
	var self = this;
	self.length = 50;
	self.width = 30;
	self.points = [new Point(0,-150),new Point(0,0)];
	self.color = '#c32000';

	self.speed = 80;
	self.direction = (new Point(2,2)).normalize();

	this.serialize = function()
	{
		var obj = new Object();
		obj.length = self.length;
		obj.width = self.width;
		obj.points = self.points;
		obj.color = self.color;
		return obj;
	}

	this.deserialize = function(dataStr)
	{
		var obj = JSON.parse(dataStr);
		self.length = obj.length;
		self.width = obj.width;
		self.points = obj.points;
		self.color = obj.color;
	}

	this.update = function(deltaTime)
	{
		forwardDistance = updateHead(deltaTime);
		updateTail(deltaTime,forwardDistance);

		// if(head().x < -400)
		// {
		// 	move(800,0);
		// }
		// if(head().x > 400)
		// {
		// 	move(-800,0);
		// }
		// if(head().y < -300)
		// {
		// 	move(0,600);
		// }
		// if(head().y > 300)
		// {
		// 	move(0,-600);
		// }

		// if(head().x < 0 || head().x > 800)
		// 	self.direction.x = -self.direction.x;
		// if(head().y < 0 || head().y > 600)
		// 	self.direction.y = -self.direction.y;

		//self.length += 10 * deltaTime;
	}

	function move(offsetX,offsetY)
	{
		for(var index in self.points)
		{
			self.points[index].x += offsetX;
			self.points[index].y += offsetY;
		}
	}

	//Head
	function updateHead(deltaTime)
	{
		var newPoint = head();
		newPoint = newPoint.add(self.direction.mul(self.speed * deltaTime));
		var forwardDistance = self.speed * deltaTime;
		var len = self.points.length;
		var oldVec = self.points[len - 1].sub(self.points[len - 2]).normalize();
		if(self.direction.normalize().equal(oldVec))
		{
			head().x = newPoint.x;
			head().y = newPoint.y;
		}
		else
		{
			self.points.push(newPoint);
		}
		return forwardDistance;
	}

	function head()
	{
		return self.points[self.points.length - 1];
	}

	//Tail
	function updateTail(deltaTime,forwardDistance)
	{
		var trackedLen = 0;
		for(var index=self.points.length-1;index >= 1;index--)
		{
			var segmentLen = self.points[index].sub(self.points[index-1]).len();
			trackedLen+=segmentLen;
			if(trackedLen >= self.length)
			{
				//track finish
				var forwardOnThisSeg =  trackedLen - self.length;
				var overLen = forwardOnThisSeg;
				var vec = self.points[index].sub(self.points[index-1]).normalize();
				self.points[index-1] = self.points[index-1].add(vec.mul(overLen));
				for(var j=0;j<index-1;j++)
				{
					self.points.shift();
				}
				return;
			}
		}
	}

}
},{"./math.js":3}]},{},[2]);
