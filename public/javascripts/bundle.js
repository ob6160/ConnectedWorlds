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
	time: 0,
	CANVAS_WIDTH: window.innerWidth,
	CANVAS_HEIGHT: window.innerHeight,
	TILE_WIDTH: 128,
	TILE_HEIGHT: 64,
	running: true,
	lastTime:  timeStamp(),
    dt: 0,
    speed: 1,
    step: (1 / 60) * 1,
    fps: 0,
    fpsaverage: 0,
    mPos: {x: 0, y: 0},
    tiles: [],
    camera: {x: 0, y: 0, w: 100, h: 100},
    player: {
    	x:128,
    	y:0,
    	w:10,
    	h:10,
    	tex: new Image(),
    	speed: 300,
    },
    images: {},
    keys: [],
};



Game.init = function() {
	this.canvas.width = this.CANVAS_WIDTH;
	this.canvas.height = this.CANVAS_HEIGHT;
	/* Init Listeners */
	this.canvas.addEventListener('mousemove', function(e) {
		var pos = util.getMousePos(this.canvas, e);
		this.mPos = pos;

		var destTile = util.isometricTransform((this.mPos.x/128)/128, (this.mPos.y/64)/64, 128, 64, this.camera.x, this.camera.y);
		
		var x1 = ~~destTile.x;
		var y1 = ~~destTile.y;
		console.log(x1, y1);
		this.tiles[x1][y1] = 1;
	}.bind(this));
	$(document).keydown(function (e) {
	    this.keys[e.keyCode] = true;
	}.bind(this));

	$(document).keyup(function (e) {
	    delete this.keys[e.keyCode];
	}.bind(this));
	/* Create Game Map */
	this.tiles = util.init2D(100, 100);

	/* Create Time Canvas */
	/*this.timeCanvas = document.createElement("canvas");
	this.timeContext = this.timeCanvas.getContext("2d");
	this.timeCanvas.width = this.canvas.width;
	this.timeCanvas.height = this.canvas.height;
	this.timeCanvas.fillRect()*/

	this.images = { tree: {url: "./images/tree.png", image: null}, grass: { url:"./images/grass1.png", image:null}, water: { url:"./images/water.png",image:null} };
	for(var i in this.images) {
		var newImage = new Image();
		
		this.images[i].image = newImage;
		newImage.onload = function() {
			this.tick();
		}.bind(this);
		newImage.src = this.images[i].url;
	}

	
};

Game.tick = function() {
	if (this.running) {
        requestAnimationFrame(function () {
	        var now =  timeStamp();
	        this.dt = this.dt + Math.min(1, (now - this.lastTime / 1000));
	        this.dt = this.dt - this.step;
	        this.render(this.dt / this.speed);
	        this.update(this.step, this.keys);
	        this.fps = (1000 / (now - this.lastTime));
	        this.fpsaverage += (this.fps - this.fpsaverage) / 8;
	        if (!this.fpsaverage) this.fpsaverage = 60;
	        this.lastTime = now;
	        this.tick();
   		}.bind(this));
	}
}

Game.update = function(dt, keys) {
	var dX, dY, nX = this.player.x, nY = this.player.y;
	dX = this.player.speed * dt;
	dY = this.player.speed * dt;

	if (keys[87]) {
		this.camera.y += dY/4; 
	} else if(keys[83]) {
		 this.camera.y -= dY/4;
	} 
	if (keys[65]) {
		this.camera.x += dX/4; 
	} else if (keys[68]) {
		this.camera.x -= dX/4;
	}
};


var aa = 1;
Game.render = function(dt) {
  	
  	tiles = this.tiles;
  	var context = this.context;
  	
  	context.fillStyle = "black";
  	context.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
  	var count  = 0;
	for(var y = 0; y < tiles.length; y++) {
		for(var x = 0; x < tiles[y].length; x++) {
			var pos = util.isometricTransform(x, y, this.TILE_WIDTH, this.TILE_HEIGHT, this.camera.x, this.camera.y);
			if(pos.x > this.canvas.width + 128 || pos.x < -128 || pos.y > this.canvas.height + 128 || pos.y < -128) continue;
			if(tiles[x][y] == 0) {
				context.drawImage(this.images.grass.image, pos.x, pos.y, this.TILE_WIDTH, this.TILE_HEIGHT);	
				//context.strokeRect(pos.x, pos.y, this.TILE_WIDTH, this.TILE_HEIGHT);
			} else if(tiles[x][y] == 1){
				context.drawImage(this.images.tree.image, pos.x, pos.y, this.TILE_WIDTH, this.TILE_HEIGHT);	
				//context.strokeRect(pos.x, pos.y, this.TILE_WIDTH, this.TILE_HEIGHT);
			} else {

			}
			
			
			//var e = util.getTileCoords(p.x, p.y, 128, 64);
			//tiles[e.x][e.y] = 1;
				
		}
	}
};


Game.init();
},{"./level":1,"./light":2,"./util":4,"./vector":5}],4:[function(require,module,exports){
Utils = {};

Utils.isometricTransform = function(x, y, w, h, oX, oY) {
	if(!oX) oX = 0;
	if(!oY) oY = 0;
	var isoX = ((x - y) * (w >> 1)) + oX;
	var isoY = ((x + y) * (h >> 1)) + oY;

	return {x: isoX, y: isoY};
};

Utils.objectIso = function(x, y, oX, oY) {
	var isoX = ((x - y)) + oX;
	var isoY = ((x + y) / 2) + oY;

	return {x: isoX, y: isoY};
}

Utils.transformIsometric = function(x, y, w, h, oX, oY) {
	//var x0 = (((x / (w/2)) + (y / (h/2))) / 2);
	//var y0 = ((y / (h/2)) - (x / (h/2))) / 2;
	 var x0 = (2 * y + x) * (w >> 1) + oX;
	 var y0 = (2 * y - x) * (w >> 1) + oY;
	return {x: x0, y: y0};
};

Utils.getTileCoords = function(x, y, w, h) {
	var x0 = ~~(x / (w));
	var y0 = ~~(y / (h));
	return {x: x0, y: y0};
};


Utils.canMove = function(nX, nY, array) {
  
  var destTile = this.getTileCoords(nX, nY, 128, 64, array);
  if(array[destTile.x][destTile.y]) {
  	return false;
  } else {
  	return true;	
  }
  

	
}

Utils.getMousePos = function(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
};

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

window.timeStamp = function () {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

Utils.init2D = function(width, height) {
	var tempArr = [];
	for(var i = 0; i < height; i++) {
		tempArr[i] = [];
		for(var j = 0; j < width; j++) {	
			
			if(j % 10 == 0 || i % 10 == 0) {
				tempArr[i][j] = null;

			} else {
				tempArr[i][j] = 0;
			}
			
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