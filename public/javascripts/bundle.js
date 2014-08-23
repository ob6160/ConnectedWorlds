(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Level() {

}

module.exports = Level;
},{}],2:[function(require,module,exports){
function Light() {

}

module.exports = Light;
},{}],3:[function(require,module,exports){
var light  = require('./light'),
level = require('./level'),
vector = require('./vector'),
util = require('./util');

var Game = {
	canvas: document.getElementById("canvas"),
	context: canvas.getContext("2d"),
	CANVAS_WIDTH: 500,
	CANVAS_HEIGHT: 500,
	TILE_WIDTH: 16,
	TILE_HEIGHT: 16,
	running: true,
	lastTime: Date.now(),
    dt: 0,
    speed: 1,
    step: (1 / 60) * this.speed,
    fps: 0,
    fpsaverage: 0,
    mPos: {x: 0, y: 0},
    tiles: [],
};

Game.init = function() {
	this.canvas.width = this.CANVAS_WIDTH;
	this.canvas.height = this.CANVAS_HEIGHT;
	/* Init Listeners */
	this.canvas.addEventListener('mousemove', function(e) {
		var pos = util.getMousePos(this.canvas, e);
		this.mPos = pos;
	}.bind(this));
	/* Create Game Map */
	this.tiles = util.init2D(100, 100);
	this.tick();
};

Game.tick = function() {
	if (this.running) {
        requestAnimationFrame(function () {
	        var now = Date.now();
	        this.dt = this.dt + Math.min(1, (now - this.lastTime / 1000));
	        this.dt = this.dt - this.step;
	        this.update(this.step);
	        this.render(this.dt / this.speed);
	        this.fps = (1000 / (now - this.lastTime));
	        this.fpsaverage += (this.fps - this.fpsaverage) / 8;
	        if (!this.fpsaverage) this.fpsaverage = 60;
	        this.lastTime = now;
	        this.tick();
   		}.bind(this));
	}
}

Game.update = function(dt) {
	
};

/*var tiles = [
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0]]*/

Game.render = function(dt) {
  	tiles = this.tiles;
  	var context = this.context;
  	
  	context.fillStyle = "blue";
  	context.fillRect(0, 0, 400, 400);
	for(var y = 0; y < tiles.length; y++) {
		for(var x = 0; x < tiles[y].length; x++) {
			
			var x1 = x * this.TILE_WIDTH;
			var y1 = y * this.TILE_HEIGHT;
			
			var pos = util.isometricTransform(x1, y1);


			context.fillStyle = "green";
			context.fillRect(pos.x, pos.y, this.TILE_WIDTH, this.TILE_HEIGHT);
	

			
		}
	}
};


Game.init();
},{"./level":1,"./light":2,"./util":4,"./vector":5}],4:[function(require,module,exports){
Utils = {};

Utils.isometricTransform = function(x, y, w, h) {
	x += 160;
	var isoX = x - y;
	var isoY = (x + y) / 2;
	return {x: isoX, y: isoY};
};

Utils.transformIsometric = function(x, y, w, h) {
	x += 160;
	var x0 = (2 * y + x) / 2;
	var y0 = (2 * y - x) / 2;
	return {x: x0, y: y0};
};

Utils.getTileCoords = function(x, y, w, h) {
	var x0 = Math.floor(x / w);
	var y0 = Math.floor(y / h);
	return {x: x0, y: y0};
};

Utils.getMousePos = function(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
};

Utils.init2D = function(width, height) {
	var tempArr = [];
	for(var i = 0; i < width; i++) {
		tempArr[i] = [];
		for(var j = 0; j < height; j++) {
			tempArr[i][j] = 0;
		}
	}
	return tempArr;
};


module.exports = Utils;
},{}],5:[function(require,module,exports){
function Vector() {

}

module.exports = Vector;
},{}]},{},[3]);