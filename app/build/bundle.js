(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var _global = (function() { return this; })();
var nativeWebSocket = _global.WebSocket || _global.MozWebSocket;
var websocket_version = require('./version');


/**
 * Expose a W3C WebSocket class with just one or two arguments.
 */
function W3CWebSocket(uri, protocols) {
	var native_instance;

	if (protocols) {
		native_instance = new nativeWebSocket(uri, protocols);
	}
	else {
		native_instance = new nativeWebSocket(uri);
	}

	/**
	 * 'native_instance' is an instance of nativeWebSocket (the browser's WebSocket
	 * class). Since it is an Object it will be returned as it is when creating an
	 * instance of W3CWebSocket via 'new W3CWebSocket()'.
	 *
	 * ECMAScript 5: http://bclary.com/2004/11/07/#a-13.2.2
	 */
	return native_instance;
}


/**
 * Module exports.
 */
module.exports = {
    'w3cwebsocket' : nativeWebSocket ? W3CWebSocket : null,
    'version'      : websocket_version
};

},{"./version":2}],2:[function(require,module,exports){
module.exports = require('../package.json').version;

},{"../package.json":3}],3:[function(require,module,exports){
module.exports={
  "_args": [
    [
      "WebSocket",
      "/Users/ocean/Documents/Projects/Game/slither/app"
    ]
  ],
  "_from": "WebSocket@latest",
  "_id": "websocket@1.0.22",
  "_inCache": true,
  "_installable": true,
  "_location": "/websocket",
  "_nodeVersion": "3.3.1",
  "_npmUser": {
    "email": "brian@worlize.com",
    "name": "theturtle32"
  },
  "_npmVersion": "2.14.3",
  "_phantomChildren": {},
  "_requested": {
    "name": "WebSocket",
    "raw": "WebSocket",
    "rawSpec": "",
    "scope": null,
    "spec": "latest",
    "type": "tag"
  },
  "_requiredBy": [
    "#USER"
  ],
  "_resolved": "https://registry.npmjs.org/websocket/-/websocket-1.0.22.tgz",
  "_shasum": "8c33e3449f879aaf518297c9744cebf812b9e3d8",
  "_shrinkwrap": null,
  "_spec": "WebSocket",
  "_where": "/Users/ocean/Documents/Projects/Game/slither/app",
  "author": {
    "email": "brian@worlize.com",
    "name": "Brian McKelvey",
    "url": "https://www.worlize.com/"
  },
  "browser": "lib/browser.js",
  "bugs": {
    "url": "https://github.com/theturtle32/WebSocket-Node/issues"
  },
  "config": {
    "verbose": false
  },
  "contributors": [
    {
      "name": "Iñaki Baz Castillo",
      "email": "ibc@aliax.net",
      "url": "http://dev.sipdoc.net"
    }
  ],
  "dependencies": {
    "debug": "~2.2.0",
    "nan": "~2.0.5",
    "typedarray-to-buffer": "~3.0.3",
    "yaeti": "~0.0.4"
  },
  "description": "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.",
  "devDependencies": {
    "buffer-equal": "^0.0.1",
    "faucet": "^0.0.1",
    "gulp": "git+https://github.com/gulpjs/gulp.git#4.0",
    "gulp-jshint": "^1.11.2",
    "jshint-stylish": "^1.0.2",
    "tape": "^4.0.1"
  },
  "directories": {
    "lib": "./lib"
  },
  "dist": {
    "shasum": "8c33e3449f879aaf518297c9744cebf812b9e3d8",
    "tarball": "https://registry.npmjs.org/websocket/-/websocket-1.0.22.tgz"
  },
  "engines": {
    "node": ">=0.8.0"
  },
  "gitHead": "19108bbfd7d94a5cd02dbff3495eafee9e901ca4",
  "homepage": "https://github.com/theturtle32/WebSocket-Node",
  "keywords": [
    "RFC-6455",
    "client",
    "comet",
    "networking",
    "push",
    "realtime",
    "server",
    "socket",
    "websocket",
    "websockets"
  ],
  "license": "Apache-2.0",
  "main": "index",
  "maintainers": [
    {
      "name": "theturtle32",
      "email": "brian@worlize.com"
    }
  ],
  "name": "websocket",
  "optionalDependencies": {},
  "readme": "ERROR: No README data found!",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/theturtle32/WebSocket-Node.git"
  },
  "scripts": {
    "gulp": "gulp",
    "install": "(node-gyp rebuild 2> builderror.log) || (exit 0)",
    "test": "faucet test/unit"
  },
  "version": "1.0.22"
}

},{}],4:[function(require,module,exports){
var Slither = require("./slither.js");
var Server = require("./server.js");
//var Server = require("./virtual_server.js");
var Point = require("./math.js");
var SlitherRender = require("./render/slither_render.js");
var SlitherMapRender = require("./render/slither_map_render.js");
var SlitherAI = require("./slither_ai.js");
module.exports = function Game(gameRender)
{
	var self = this;
	self.slither = null; //self

	self.gameRender = gameRender;
	self.gameRender.focusCallback = function()
	{
		if(self.slither)
		{
			var pt = self.slither.points[self.slither.points.length - 1];
			return pt;
		}
		return new Point(0,0);
	}

	
	self.slitherCreated = null;
	self.updateCallback = null;
	self.otherSlithers = new Object();//other player's slithers
	self.slitherAIs = new Array();

	self.slitherMap = new Array();
	this.server = new Server("",function(command,obj){
		if(command == self.server.Server_Command_Login)
		{
			self.slither = new Slither(0,0);
			self.slither.deserialize(obj);
			if(self.slitherCreated)
				self.slitherCreated();
			if(!(typeof WebSocket === 'undefined'))
				self.gameRender.registerRender(new SlitherRender(self.slither));
			self.begin();
			
			self.server.loadMap();
		}
		else if(command == self.server.Server_Command_SyncSlither)
		{
			if(self.slither && obj.uid == self.slither.uid)
			{
				self.slither.deserialize(obj);
				return;
			}
			if(!self.otherSlithers[obj.uid])
			{
				self.otherSlithers[obj.uid] = new Slither();
				if(!(typeof WebSocket === 'undefined'))
					self.gameRender.registerRender(new SlitherRender(self.otherSlithers[obj.uid]),obj.uid);
			}
			self.otherSlithers[obj.uid].deserialize(obj);
				
		}
		else if(command == self.server.Server_Command_Map)
		{
			self.slitherMap = obj;
			if(!(typeof WebSocket === 'undefined'))
			{
				if(self.gameRender.isRenderRegistered("SlitherMap") == false)
					self.gameRender.registerRender(new SlitherMapRender(self.slitherMap),"SlitherMap");
				else
				{
					self.gameRender.registeredRender("SlitherMap").map = obj;
				}
			}
		}
		else if(command == self.server.Server_Command_EatFood)
		{
			delete self.slitherMap[obj];
		}
		else if(command == self.server.Server_Command_Logout)
		{
			delete self.otherSlithers[obj];
			self.gameRender.unregisterRender(obj);
		}
		else if(command == self.server.Server_Command_Kill)
		{
			if(obj == self.slither.uid)
			{
				self.end();
				self.slither = null;
				self.otherSlithers = new Object();
				document.location = document.location.href;
			}
		}
	});
	this.server.login("ocean" + Math.random() * 10);

	this.updateHandler = 0;
	this.begin = function()
	{
		console.log('begin');
		self.gameRender.isRunning = true;
		self.updateHandler = setInterval(function(){
			window.game.update(1000/30);
		}, 1000/30);
	}

	this.end = function()
	{
		self.gameRender.isRunning = false;
		clearInterval(self.updateHandler);
	}

	var lastUpdatePointsTime = 0.05;
	this.update = function(deltaTime)
	{
		deltaTime /= 1000;
		if(self.slither == null)
			return;
		if(self.updateCallback)
			self.updateCallback(deltaTime);
		self.slither.update(deltaTime);

		// for(var key in self.slitherAIs)
		// {
		// 	self.slitherAIs[key].update(deltaTime);
		// 	checkSlitherEatFood(self.slitherAIs[key].slither);
		// 	dieTest(self.slither,self.slitherAIs[key].slither);

		// 	if(self.slitherAIs[key].slither.dead)
		// 	{
		// 		delete self.slitherAIs[key];
		// 	}
		// }

		checkSlithersEatFood();
		checkSlitherCollide();


		if(lastUpdatePointsTime <= 0)
		{
			self.server.syncSlither(self.slither.serialize());
			lastUpdatePointsTime = 0.05;
		}
		else
		{
			self.server.syncSlitherExceptPoints(self.slither.serializeExceptPoints());
		}
		lastUpdatePointsTime -= deltaTime;


		checkSlitherEatFood(self.slither);

	}

	function checkSlitherEatFood(slither)
	{
		var lastPt = slither.points[slither.points.length - 1];
		for(var prop in self.slitherMap)
		{
			var mapUnit = self.slitherMap[prop];
			var point = new Point(mapUnit.x,mapUnit.y);
			if(point.sub(lastPt).len() <= slither.width && 
				prop.isCatched == undefined)
			{
				self.server.eatFood(prop);
				prop.isCatched = true;
			}
		}
	}

	function checkSlithersEatFood()
	{
		for(var key in self.slitherAIs)
		{
			checkSlitherEatFood(self.slitherAIs[key].slither);
		}
		for(var key in self.otherSlithers)
		{
			checkSlitherEatFood(self.otherSlithers[key]);
		}	
	}

	function checkSlitherCollide()
	{
		for(var key in self.slitherAIs)
		{
			dieTest(self.slither,self.slitherAIs[key]);
		}
		for(var key in self.otherSlithers)
		{
			dieTest(self.slither,self.otherSlithers[key]);
		}	
	}

	function dieTest(slither1,slither2)
	{
		var dieSlither = slither1.dieTest(slither2);
		if(dieSlither)
		{
			dieSlither.die();
			console.log(dieSlither + " die");
			if(dieSlither != self.slither)
			{
				self.server.kill(dieSlither.uid);
				//self.slitherAIs.push(new SlitherAI(window.gameRender));
			}	
		}
	}
}
},{"./math.js":6,"./render/slither_map_render.js":8,"./render/slither_render.js":9,"./server.js":10,"./slither.js":11,"./slither_ai.js":12}],5:[function(require,module,exports){
var Game = require("./game.js");
var Point = require("./math.js");
var GameRender = require("./render/game_render.js");
var SlitherRender = require("./render/slither_render.js");
var SlitherAI = require("./slither_ai.js");
window.onload = function()
{
	window.gameRender = new GameRender('canvas',function(deltaTime){
		
	});
	window.game = new Game(window.gameRender);

	//game.slitherAIs.push(new SlitherAI(window.gameRender));
}

window.addEventListener('mousemove',function(e){
	if(game.slither == null)
		return;
	direction = new Point(e.clientX - window.innerWidth/2,  e.clientY - window.innerHeight/2);
	direction = direction.normalize();
	game.slither.direction = direction;
});

window.addEventListener('touchmove',function(e){
	e = e.touches[0];
	if(game.slither == null)
		return;
	direction = new Point(e.clientX - window.innerWidth/2,  e.clientY - window.innerHeight/2);
	direction = direction.normalize();
	game.slither.direction = direction;

	e.preventDefault();
});

window.addEventListener('keydown',function(e){
	if(game.slither == null)
		return;
	if(e.keyCode == 32)
	{
		game.slither.speed = 200; 
	}
});

window.addEventListener('keyup',function(e){
	if(game.slither == null)
		return;
	if(e.keyCode == 32)
	{
		game.slither.speed = 100;
	}
});
},{"./game.js":4,"./math.js":6,"./render/game_render.js":7,"./render/slither_render.js":9,"./slither_ai.js":12}],6:[function(require,module,exports){
var xVec = new Point(1,0);
function Point(x,y)
{
	var self = this;
	self.x = x;
	self.y = y;
	self.assign = function(target)
	{
		target.x = self.x;
		target.y = self.y;
	}

	

	self.add = function(pt,addToSelf)
	{
		if(addToSelf)
		{
			self.x += pt.x;
			self.y += pt.y;
		}
		else
			return new Point(self.x + pt.x,self.y + pt.y);
	}

	self.sub = function(pt,addToSelf)
	{		
		if(addToSelf)
		{
			self.x -= pt.x;
			self.y -= pt.y;
		}
		else
			return new Point(self.x - pt.x,self.y - pt.y);
	}

	self.mul = function(val,addToSelf)
	{
		if(addToSelf)
		{
			self.x *= val;
			self.y *= val;
		}
		else
			return new Point(self.x * val,self.y * val);
	}

	self.len = function()
	{
		return Math.sqrt(self.x * self.x + self.y*self.y);
	}

	self.normalize = function(addToSelf)
	{
		var len = Math.sqrt(self.x * self.x + self.y*self.y);
		if(addToSelf)
		{
			self.x /= len;
			self.y /= len;
		}
		else
			return new Point(self.x / len,self.y / len);
	}

	self.equal = function(pt)
	{
		if(Math.abs(self.x - pt.x) < 0.00000001 && Math.abs(self.y - pt.y) < 0.00000001)
			return true;
		return false;
	}

	self.normal = function(addToSelf)
	{
		var len = Math.sqrt(self.x * self.x + self.y*self.y);
		var normalizePtX = self.x / len;
		var normalizePtY = self.y / len;
		var y = normalizePtX / Math.sqrt(1 + normalizePtY * normalizePtY);
		var x = Math.sqrt(1 - y * y);

		if(addToSelf)
		{
			self.x = x;
			self.y = y;
		}
		else
			return new Point(x,y);
	}

	self.rotate = function(fromVec,toVec,addToSelf)
	{
		//fromVec x,y
		//toVec x',y'
		var sin = (fromVec.x * toVec.y - fromVec.y * toVec.x) / (fromVec.x * fromVec.x + fromVec.y * fromVec.y);
		var cos = 0;
		if(fromVec.x == 0)
			cos = 0;
		else
			cos = toVec.x/fromVec.x + fromVec.y/fromVec.x * sin;

		var newX = self.x * cos - self.y * sin;
		var newY = self.x * sin + self.y * cos;

		if(addToSelf)
		{
			self.x = newX;
			self.y = newY;
			return;
		}
		return new Point(newX,newY);
	}

	self.pointToLineDistance = function(pt,lineBegin,lineEnd)
	{
		pt.x -= lineBegin.x;
		pt.y -= lineBegin.y;
		lineEnd.x -= lineBegin.x;
		lineEnd.y -= lineBegin.y;
		lineBegin.x = 0;
		lineBegin.y = 0;

		var len = lineEnd.len();
		lineEnd.normalize(true);
		pt.rotate(lineEnd,xVec,true);
		if(pt.x >=0 && pt.x <= len)
			return Math.abs(pt.y);
		return -1;
	}
}
module.exports = Point;
},{}],7:[function(require,module,exports){
var Point = require("../math.js")
module.exports = function GameRender(canvasId,updateCallBack) {
	var self = this;
	self.isRunning = false;

	var width = window.innerWidth;
	var height = window.innerHeight;
	self.canvas = document.getElementById(canvasId);
	self.context = canvas.getContext('2d');
	canvas.width = width;
	canvas.height = height;

	this.registeredRenders = new Array();
	this.mappedRenders = new Object();

	this.registeredRender = function(uid)
	{
		return this.mappedRenders[uid];
	}

	this.registerRender = function(render,uid)
	{
		self.registeredRenders.push(render);
		if(uid)
		{
			this.mappedRenders[uid] = render;
		}
	}

	this.unregisterRender = function(uid)
	{
		if(this.mappedRenders[uid])
		{
			this.mappedRenders[uid].invalid = true;
		}
	}

	this.isRenderRegistered = function(uid)
	{
		return this.mappedRenders[uid] != undefined;
	}

	var lastDate = new Date();

	//init fps counter
	//var stats = new Stats();
	//stats.showPanel( 1 );
	//document.body.appendChild( stats.dom );


	var render = function () {
		requestAnimationFrame( render );
		if(self.isRunning == false)
			return;

		//stats.begin();
		var now = new Date();
		var delta = (now - lastDate);
		lastDate = now;

		self.context.fillStyle = "#333333";
		self.context.fillRect(0,0,self.canvas.width,self.canvas.height);
		
		var offset = new Point(0,0);
		if(self.focusCallback)
		{
			offset = self.focusCallback();
		}

		self.context.save();
		self.context.translate(-offset.x + self.canvas.width / 2,-offset.y + self.canvas.height / 2);

		self.context.strokeStyle = "#888888";
		self.context.beginPath();
		var mapLength = 10000;
		for(var x = -mapLength;x < mapLength;x += 50)
		{
			self.context.moveTo(x,-mapLength);
			self.context.lineTo(x,mapLength);
		}
		
		for(var y = -mapLength;y < mapLength;y += 50)
		{
			self.context.moveTo(-mapLength,y);
			self.context.lineTo(mapLength,y);
		}

		self.context.stroke();


		self.context.fillStyle = "#f0f";
		self.context.fillRect(0,0,20,20);
		for(var key in self.registeredRenders)
		{
			if(self.registeredRenders[key].invalid)
				delete self.registeredRenders[key];
			else
				self.registeredRenders[key].update(delta,self);
		}

		self.context.restore();
		if(updateCallBack)
			updateCallBack(delta,self);

		//stats.end();
	};
	render();
}

},{"../math.js":6}],8:[function(require,module,exports){
module.exports = function SlitherMapRender(map)
{
	var self = this;
	this.map = map;
	this.update = function(deltaTime,gameRender)
	{
		var context = self.context;
		for(var key in self.map)
		{
			var point = self.map[key];
			gameRender.context.fillStyle = "#ff0000";
			gameRender.context.fillRect(point.x,point.y,5,5);
		}
	}
}
},{}],9:[function(require,module,exports){
var Point = require("../math.js");
module.exports = function SlitherRender(slither)
{
	var self = this;
	this.slither = slither;
	this.meshes = new Array();
	var img = new Image();
	img.src = "circle_mask.png";
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
		context.strokeText("ocean:" + self.slither.targetDegree,firstPt.x,firstPt.y - 5);
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
			//context.fillStyle = "#330000";
			//context.fillRect(slither.points[pointSearchIndex].x,slither.points[pointSearchIndex].y,10,10);

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
},{"../math.js":6}],10:[function(require,module,exports){
var Socket = require("./socket.js");
function Server(serverUrl,commandCallBack)
{
	var self = this;

	self.Server_Command_Login = 10000;
	self.Server_Command_SyncSlither = 10001;
	self.Server_Command_Map = 10002;
	self.Server_Command_Kill = 10003;
	self.Server_Command_EatFood = 10004;
	self.Server_Command_Logout = 10005;

	self.Server_Command_SyncSlitherExceptPoints = 10006;

	self.commandCallBack = commandCallBack;

	self.avaliable = false;

	var websocket;
	this.login = function(nickname)
	{
		if(websocket)
			return;
		websocket = new Socket("ws://192.168.0.102:8081",'slither');//serverUrl
		websocket.onmessage = function(e)
		{
			var obj = JSON.parse(e.data);
			processResponse(obj);
		}
		websocket.onopen = function(e)
		{
			console.log("Connect success!!! Begin login...");
			sendCommand(self.Server_Command_Login,{'nickname':nickname});
		}
	}

	this.loadMap = function()
	{
		sendCommand(self.Server_Command_Map,"");	
	}

	this.syncSlither = function(slither)
	{
		sendCommand(self.Server_Command_SyncSlither,slither);	
	}

	this.syncSlitherExceptPoints = function(slither)
	{
		sendCommand(self.Server_Command_SyncSlitherExceptPoints,slither);	
	}

	this.eatFood = function(uid)
	{
		sendCommand(self.Server_Command_EatFood,uid);	
	}

	this.kill = function(uid)
	{
		sendCommand(self.Server_Command_Kill,uid);
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
			if(self.commandCallBack)
			{
				self.commandCallBack(obj.command,obj.data);
			}
		}
	}

	function sendCommand(command,data)
	{
		if(websocket == null)
			return;
		var result = new Object();
		result.command = command;
		result.data = data;
		websocket.send(JSON.stringify(result));
	}
}

module.exports = Server;
},{"./socket.js":13}],11:[function(require,module,exports){
var Point = require("./math.js");

module.exports = function Slither(xLoc,yLoc,data)
{
	if(!xLoc)
		xLoc = 0;
	if(!yLoc)
		yLoc = 0;
	var self = this;
	self.nickname = "";
	self.uid = "";
	self.length = 200;
	self.width = 20;
	self.points = [new Point(xLoc,yLoc-200),new Point(xLoc,yLoc)];
	self.color = '#ff3300';

	self.speed = 90;
	self.direction = (new Point(2,2)).normalize();

	self.turnToDirection = function(direction)
	{
		self.targetDegree = self.directionToDegree(direction);
	}

	self.degreeToDirection = function(degree)
	{
		self.direction.x = Math.cos(degree / 180 * 3.14);
		self.direction.y = -Math.sin(degree / 180 * 3.14);
		return self.direction;
	}

	self.directionToDegree = function(direction)
	{
		var atan = direction.y / direction.x;
		var degree = Math.atan(atan)/3.14 * 180;
		var x = direction.x;
		var y = direction.y;
		if(x > 0)
		{
			if(y <= 0)
			{
				degree = -degree;
			}
			else
			{
				degree = 360 - degree;
			}
		}
		else
		{
			if(y <= 0)
			{
				degree = 180 - degree;
			}
			else
			{
				degree = 180 - degree;
			}
		}
		return degree;
	}

	self.targetDegree = self.directionToDegree(self.direction);

	this.updateDirection = function(deltaTime)
	{
		var nowDegree = self.directionToDegree(self.direction);
		if(Math.abs(self.targetDegree - nowDegree) > 0.0000001)
		{
			nowDegree += (self.targetDegree - nowDegree) / 4;
		}
		self.direction = self.degreeToDirection(nowDegree);
	}

	this.serialize = function()
	{
		var obj = new Object();
		obj.length = self.length;
		obj.width = self.width;
		obj.points = self.points;
		obj.color = self.color;
		obj.uid = self.uid;
		return obj;
	}

	this.serializeExceptPoints = function()
	{
		var obj = new Object();
		obj.length = self.length;
		obj.width = self.width;
		obj.color = self.color;
		obj.uid = self.uid;
		obj.nickname = self.nickname;
		obj.direction = self.direction;
		return obj;
	}

	this.deserialize = function(obj)
	{
		self.length = obj.length;
		self.width = obj.width;
		self.points = new Array();
		for(var key in obj.points)
		{
			self.points.push(new Point(obj.points[key].x,obj.points[key].y));
		}
		self.uid = obj.uid;
		self.nickname = obj.nickname;
		self.color = obj.color;
	}

	this.update = function(deltaTime)
	{
		//this.updateDirection(deltaTime);
		forwardDistance = updateHead(deltaTime);
		updateTail(deltaTime,forwardDistance);
	}

	var dieTestHead = new Point();
	var dieTestLineBegin = new Point();
	var dieTestLineEnd = new Point();
	this.dieTest = function(slither)
	{
		for(var i = 0;i < slither.points.length - 1;i++)
		{
			head().assign(dieTestHead);
			slither.points[i].assign(dieTestLineBegin);
			slither.points[i + 1].assign(dieTestLineEnd);

			var distance = dieTestHead.pointToLineDistance(dieTestHead,dieTestLineBegin,dieTestLineEnd);
			if(distance >=0 && distance < slither.width / 2 + self.width / 2)
			{
				//i die
				return self;
			}
		}

		for(var i = 0;i < self.points.length - 1;i++)
		{
			slither.points[slither.points.length - 1].assign(dieTestHead);
			self.points[i].assign(dieTestLineBegin);
			self.points[i + 1].assign(dieTestLineEnd);
			var distance = dieTestHead.pointToLineDistance(dieTestHead,dieTestLineBegin,dieTestLineEnd);
			if(distance >=0 && distance < slither.width / 2 + self.width / 2)
			{
				//u die
				return slither;
			}
		}
	}

	this.die = function()
	{
		self.dead = true;
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

	var caculatePoint = new Point();
	//Tail
	function updateTail(deltaTime,forwardDistance)
	{
		var trackedLen = 0;
		for(var index=self.points.length-1;index >= 1;index--)
		{
			self.points[index].assign(caculatePoint);
			caculatePoint.sub(self.points[index-1],true);
			var segmentLen = caculatePoint.len();
			trackedLen+=segmentLen;
			if(trackedLen >= self.length)
			{
				//track finish
				var forwardOnThisSeg =  trackedLen - self.length;
				var overLen = forwardOnThisSeg;
				self.points[index-1].add(caculatePoint.mul(overLen / segmentLen),true);
				for(var j=0;j<index-1;j++)
				{
					self.points.shift();
				}
				return;
			}
		}
	}

}
},{"./math.js":6}],12:[function(require,module,exports){
var Slither = require("./slither.js");
var SlitherRender = require("./render/slither_render.js");
var GameRender = require("./render/game_render.js");
var Point = require("./math.js");
module.exports = function SlitherAI(gameRender,slither)
{
	var self = this;
	if(slither)
		self.slither = slither;
	else
	{
		self.slither = new Slither(200,100);
		self.slither.color = "#2222ff";
		// self.slither.width = 15;
		self.slither.length = 300;
		self.slither.speed = 170;
	}
	if(gameRender)
		gameRender.registerRender(new SlitherRender(self.slither));


	var thinkDelay = 1;
	var targetFoodUid;

	this.update = function(deltaTime)
	{
		thinkDelay -= deltaTime;
		if(thinkDelay <= 0)
		{
			thinkDelay = 1;

			nearestFood();

			if(window.game.slitherMap[targetFoodUid])
			{
				var food = window.game.slitherMap[targetFoodUid];
				self.slither.direction.x = food.x - self.slither.points[self.slither.points.length - 1].x;
				self.slither.direction.y = food.y - self.slither.points[self.slither.points.length - 1].y;
				self.slither.direction.normalize(true);
			}
		}
		self.slither.update(deltaTime);
	}


	var nearestFoodPoint = new Point();
	function nearestFood()
	{
		var foods = window.game.slitherMap;
		
		var distance = 100000000;
		for(var key in foods)
		{
			nearestFoodPoint.x = foods[key].x;
			nearestFoodPoint.y = foods[key].y;
			nearestFoodPoint.sub(self.slither.points[self.slither.points.length - 1],true);
			var newLen = nearestFoodPoint.len();
			if(newLen < distance)
			{
				distance = newLen;
				targetFoodUid = key;
			}
		}
	}
}
},{"./math.js":6,"./render/game_render.js":7,"./render/slither_render.js":9,"./slither.js":11}],13:[function(require,module,exports){
function Socket(url,protocol)
{
	var self = this;
	self.brSock = null;
	self.nodeSock = null;
	self.nodeConn = null;
	if(typeof WebSocket === 'undefined')
	{
		var NodeSock = require("WebSocket").client;
		self.nodeSock = new NodeSock();
		self.nodeSock.on('connect',function(connection)
		{
			console.log("Connected");
			self.nodeConn = connection;
			if(self.onopen)
			{
				self.onopen('');
			}
			connection.on('message',function(e)
			{
				if(self.onmessage)
				{
					//console.log(e.utf8Data);
					self.onmessage({'data':e.utf8Data});
				}
			});
		});
		self.nodeSock.connect(url,protocol);
	}
	else
	{
		self.brSock = new window.WebSocket(url,protocol);
		self.brSock.onopen = function(e)
		{
			if(self.onopen)
			{
				self.onopen(e);
			}
		}
		self.brSock.onmessage = function(e)
		{
			if(self.onmessage)
			{
				self.onmessage(e);
			}
		}
	}

	self.send = function(message)
	{
		if(self.nodeConn)
		{
			self.nodeConn.sendUTF(message);
		}
		if(self.brSock)
		{
			self.brSock.send(message);
		}
	}
}

module.exports = Socket;
},{"WebSocket":1}]},{},[5]);
