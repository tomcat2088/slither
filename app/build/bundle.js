(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Slither = require("./slither.js");
//var Server = require("./server.js");
var Server = require("./virtual_server.js");
var Point = require("./math.js");
var SlitherRender = require("./render/slither_render.js");
var SlitherMapRender = require("./render/slither_map_render.js");
var SlitherAI = require("./slither_ai.js");
module.exports = function Game()
{
	var self = this;

	self.slither = null; //self

	self.otherSlithers = new Object();//other player's slithers
	self.slitherAIs = new Array();

	self.slitherMap = new Array();
	this.server = new Server("",function(command,obj){
		if(command == self.server.Server_Command_Login)
		{
			loginUser = obj.data;
			self.server.loadMap();
		}
		else if(command == self.server.Server_Command_Sync)
		{
			if(obj.uid == self.server.loginUser.uid)
			{
				self.slither.deserialize(obj.data);
				return;
			}
			if(!self.otherSlithers[obj.uid])
			{
				self.otherSlithers[obj.uid] = new Slither();
				window.gameRender.registerRender(new SlitherRender(self.otherSlithers[obj.uid]),obj.uid);
			}
			self.otherSlithers[obj.uid].deserialize(obj.data);
				
		}
		else if(command == self.server.Server_Command_Map)
		{
			self.slitherMap = obj.data;
			window.gameRender.registerRender(new SlitherMapRender(self.slitherMap));
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

		for(var key in self.slitherAIs)
		{
			self.slitherAIs[key].update(deltaTime);
			checkSlitherEatFood(self.slitherAIs[key].slither);
			dieTest(self.slither,self.slitherAIs[key].slither);

			if(self.slitherAIs[key].slither.dead)
			{
				delete self.slitherAIs[key];
			}
		}

		self.server.sync(self.slither.serialize());

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
				self.server.catchProp(prop);
				prop.isCatched = true;
			}
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
				self.server.kill(dieSlither);
				self.slitherAIs.push(new SlitherAI(window.gameRender));
			}	
		}
	}
}
},{"./math.js":3,"./render/slither_map_render.js":5,"./render/slither_render.js":6,"./slither.js":8,"./slither_ai.js":9,"./virtual_server.js":10}],2:[function(require,module,exports){
var Game = require("./game.js");
var Point = require("./math.js");
var GameRender = require("./render/game_render.js");
var SlitherRender = require("./render/slither_render.js");
var SlitherAI = require("./slither_ai.js");
window.onload = function()
{
	window.game = new Game();
	window.gameRender = new GameRender('canvas',function(deltaTime){
		
	});
	setInterval(function(){
		window.game.update(1000/30);
	}, 1000/30);

	window.gameRender.registerRender(new SlitherRender(game.slither));
	window.gameRender.focusCallback = function()
	{
		var pt = game.slither.points[game.slither.points.length - 1];
		return pt;
	}

	game.slitherAIs.push(new SlitherAI(window.gameRender));
}

window.addEventListener('mousemove',function(e){
	direction = new Point(e.clientX - window.innerWidth/2,  e.clientY - window.innerHeight/2);
	direction = direction.normalize();
	game.slither.direction = direction;
});

window.addEventListener('keydown',function(e){
	if(e.keyCode == 32)
	{
		game.slither.speed = 200; 
	}
});

window.addEventListener('keyup',function(e){
	if(e.keyCode == 32)
	{
		game.slither.speed = 100;
	}
});
},{"./game.js":1,"./math.js":3,"./render/game_render.js":4,"./render/slither_render.js":6,"./slither_ai.js":9}],3:[function(require,module,exports){
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
		if(self.x == pt.x && self.y == pt.y)
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
},{}],4:[function(require,module,exports){
var textureManager = require("./texture_manager.js")
var Point = require("../math.js")
module.exports = function GameRender(canvasId,updateCallBack) {
	var self = this;

	var width = window.innerWidth;
	var height = window.innerHeight;
	self.canvas = document.getElementById(canvasId);
	self.context = canvas.getContext('2d');
	canvas.width = width;
	canvas.height = height;

	this.registeredRenders = new Array();
	this.mappedRenders = new Object();
	this.registerRender = function(render,uid)
	{
		self.registeredRenders.push(render);
		if(uid)
		{
			this.mappedRenders[uid] = render;
		}
	}

	this.isRenderRegistered = function(uid)
	{
		return this.mappedRenders[uid] != undefined;
	}

	var lastDate = new Date();

	//init fps counter
	var stats = new Stats();
	stats.showPanel( 1 );
	document.body.appendChild( stats.dom );


	var render = function () {
		requestAnimationFrame( render );
		stats.begin();
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

		stats.end();
	};
	render();
}

},{"../math.js":3,"./texture_manager.js":7}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
		context.strokeText("name:" + Math.atan(degree)/3.14 * 180,firstPt.x,firstPt.y - 5);
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
},{"../math.js":3,"./texture_manager.js":7}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
var Point = require("./math.js");

module.exports = function Slither(xLoc,yLoc)
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
			
	}

	this.serialize = function()
	{
		var obj = new Object();
		obj.length = self.length;
		obj.width = self.width;
		obj.points = self.points;
		obj.color = self.color;
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
		self.color = obj.color;
	}

	this.update = function(deltaTime)
	{
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
},{"./math.js":3}],9:[function(require,module,exports){
var Slither = require("./slither.js");
var SlitherRender = require("./render/slither_render.js");
var GameRender = require("./render/game_render.js");
var Point = require("./math.js");
module.exports = function SlitherAI(gameRender)
{
	var self = this;
	self.slither = new Slither(200,100);
	self.slither.color = "#2222ff";
	// self.slither.width = 15;
	self.slither.length = 300;
	self.slither.speed = 170;
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
},{"./math.js":3,"./render/game_render.js":4,"./render/slither_render.js":6,"./slither.js":8}],10:[function(require,module,exports){
module.exports = function VirtualServer(url,commandCallBack)
{
	//sync,eat food,kill slither,load map
	var self = this;

	self.Server_Command_Login = 10000;
	self.Server_Command_Sync = 10001;
	self.Server_Command_Message = 10002;
	self.Server_Command_Logout = 10003;
	self.Server_Command_Map = 10004;
	self.Server_Command_CatchProp = 10005;
	self.Server_Command_Kill = 10006;

	self.mapUnits = new Array();
	self.slithers = new Object();
	this.login = function(nickname)
	{
		setTimeout(function(){
			if(commandCallBack)
			{
				//serve
				var slither = new Slither();
				slither.nickname = nickname;
				slither.uid = (new Date()).getTime();
				self.slithers[slither.uid] = slither;
				commandCallBack(self.Server_Command_Login,slither);
			}
		},1000);
	}

	this.syncSlither = function(slither)
	{
		if(commandCallBack)
		{
			self.slithers[slither.uid] = slither;
			//commandCallBack(self.Server_Command_Sync,data);
		}
	}

	this.loadMap = function()
	{
		if(commandCallBack)
		{
			if(self.mapUnits.length <= 0)
			{
				self.mapUnits = new Array();
				for(var i=0;i<50;i++)
				{
					self.mapUnits[i] = {uid:i,x:Math.random() * 1000,y:Math.random() * 1000};
				}
			}
			commandCallBack(self.Server_Command_Map,self.mapUnits);
		}	
	}

	this.catchProp = function(slitherUid,propUid)
	{
		if(self.mapUnits[propUid] && self.slither[slitherUid])
		{
			//TODO: self.slither[slitherUid].catch(self.mapUnits[propUid]);
			delete self.mapUnits[propUid];
			commandCallBack(self.Server_Command_Sync,self.slither[slitherUid]);
		}
	}

	this.kill = function(slitherUid)
	{
		for(var key in slither.points)
		{
			var pt = slither.points[key];
			var uid = (new Date()).getTime() + "-" + key;
			self.mapUnits[uid] = {uid:uid,x:pt.x,y:pt.y};
		}
		commandCallBack(self.Server_Command_Map,{data:self.mapUnits});
	}
}
},{}]},{},[2]);
