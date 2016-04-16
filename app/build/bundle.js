(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// window.onload = function()
// {
// 	window.game = new Game();
// 	window.gameRender = new GameRender(document.body,{width:400,height:400});

// 	window.gameRender.registerRender(new SlitherRender(game.slither));
// }

// window.addEventListener('mousemove',function(e){
// 	direction = new Point(e.clientX - 400,e.clientY - 300);
// 	direction = direction.normalize();
// 	game.slither.direction = direction;
// });

var slither = require("./slither.js");
var slither_o = slither();
console.log(slither_o);
},{"./slither.js":3}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
Point = require("./math.js");

module.exports = function Slither()
{
	var self = this;
	self.length = 150;
	self.width = Math.random() * 10;
	self.points = [new Point(0,-50),new Point(0,0)];
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

		if(head().x < -400)
		{
			move(800,0);
		}
		if(head().x > 400)
		{
			move(-800,0);
		}
		if(head().y < -300)
		{
			move(0,600);
		}
		if(head().y > 300)
		{
			move(0,-600);
		}

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
},{"./math.js":2}]},{},[1]);
