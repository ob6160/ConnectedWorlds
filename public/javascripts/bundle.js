(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var util = require("./util");

function Level() {
	this.data = [];

}

Level.prototype.buildLevel = function(w, h) {
	this.data = util.init2D(w, h);
	var iX = 0;
	var yX = 0;
	for(var y = 0; y < h; y++) {
		for(var x = 0; x < w; x++) {
			//this.data[x][y] = 0;

		}
	}
}
Level.prototype.appendTo = function(world) {
	//this.data.push([0,0,0,0,0,0,0,0,0,0]);
	
}

module.exports = Level;
},{"./util":5}],2:[function(require,module,exports){
function Light() {

}

module.exports = Light;
},{}],3:[function(require,module,exports){
var light  = require('./light'),
level = require('./level'),
vector = require('./vector'),
util = require('./util'),
world = require('./world'),
person = require("./person");

window.Game = {
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
    selectedTile: {x: 0, y:0},
    easystar: new EasyStar.js(),
    selector: { image: "stone" },
    resources: {stone: 10, wood: 10, people: 0},
    starting: true,
    startPos: {x: -402, y: -475},
    keyLocs: { bridge1: {x: 671.7137818924919, y: 418.2072049724717} },
    entities: [],
};

Game.getResources = function() {
	
	if(!this.resources) return false;
	return this.resources;
}

Game.setResources = function(res) {
	if(!res) return false;
	this.resources = res;
	return true;
}

Game.changeResources = function(res) {
	if(!res) return false;
	for(var i in this.resources) {
		this.resources[i] += res[i];
	}
	return true;
}

Game.init = function() {
	this.canvas.width = this.CANVAS_WIDTH;
	this.canvas.height = this.CANVAS_HEIGHT;
	/* Init Listeners */
	this.canvas.addEventListener('mousemove', function(e) {
		var pos = util.getMousePos(this.canvas, e);
        this.mPos = pos;
		var x = this.mPos.x;
		var y = this.mPos.y;
		this.selectedTile = util.getTileCoords(x, y, this.TILE_WIDTH, this.TILE_HEIGHT, this.camera.x, this.camera.y);
		var selectedTileIso = util.isometricTransform(~~this.selectedTile.x, ~~this.selectedTile.y, this.TILE_WIDTH, this.TILE_HEIGHT, this.camera.x, this.camera.y);
		this.selectedTile.isoX = selectedTileIso.x;
		this.selectedTile.isoY = selectedTileIso.y;
	}.bind(this));
	$(document).keydown(function (e) {
	    this.keys[e.keyCode] = true;
	}.bind(this));

	$(document).keyup(function (e) {
	    delete this.keys[e.keyCode];
	}.bind(this));

	this.canvas.requestPointerLock = this.canvas.requestPointerLock ||
                            this.canvas.mozRequestPointerLock ||
                            this.canvas.webkitRequestPointerLock;
	this.canvas.requestPointerLock()



	var images = this.images;
	var selector = this.selector;
	$(".select img").on("click", function(e) {
		var class1 = $(this).attr("class");
		util.changeObject(class1, images, selector);
	});



	var testPerson = new person(671.7137818924919, 418.2072049724717, null);
	testPerson.type = "build";
	this.entities.push(testPerson);



	/* Create Game Map */

	this.tiles = world;



	this.easystar.setGrid(this.tiles);
	this.easystar.setAcceptableTiles([0]);
	
	this.context.imageSmoothingEnabled = false;
	
	/* Create Time Canvas */
	/*this.timeCanvas = document.createElement("canvas");
	this.timeContext = this.timeCanvas.getContext("2d");
	this.timeCanvas.width = this.canvas.width;
	this.timeCanvas.height = this.canvas.height;
	this.timeCanvas.fillRect()*/

	this.images = { tree: {url: "./images/tree.png", image: null}, grass: { url:"./images/grass1.png", image:null}, water: { url:"./images/water.png",image:null}, stone: { url:"./images/stonemason.png",image:null}, wood: { url:"./images/woodchopper.png",image:null}, build: { url:"./images/builder.png",image:null}, war: { url:"./images/garrison.png",image:null} };
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
	if(this.starting) {
		var vel = util.moveTo(this.camera.x, this.camera.y, this.startPos.x, this.startPos.y, 3);
		if(~~this.camera.x === ~~this.startPos.x) {
			this.starting = !this.starting;
		} else {
			this.camera.x += vel.x;
			this.camera.y += vel.y;
		}
		
	}

	for(var i = 0; i < this.entities.length; i++) {
		this.entities[i].update(dt);
	}
};


var aa = 1;
Game.render = function(dt) { 
  	var context = this.context;
  	context.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

	for(var y = 0; y < this.tiles.length; y++) {
		for(var x = 0; x < this.tiles[y].length; x++) {
			
			var pos = util.isometricTransform(x, y, this.TILE_WIDTH, this.TILE_HEIGHT, this.camera.x, this.camera.y);
			
			if(pos.x > this.canvas.width + 128 || pos.x < -128 || pos.y > this.canvas.height + 128 || pos.y < -128) continue;
			
			try {
			var tile = this.tiles[x][y];
			} catch(e) {

			}			
			/*	Key: Grass 0	Water 1 	Tree 2 	  Stone 3 	  Wood 4 	War 5	*/
			if(tile == 0) {
				context.drawImage(this.images.grass.image, pos.x, pos.y, this.TILE_WIDTH, this.TILE_HEIGHT);	
			} else if(tile == 1) {
				context.drawImage(this.images.water.image, pos.x, pos.y, this.TILE_WIDTH, this.TILE_HEIGHT);	
			} else if(tile == 2) {
				context.drawImage(this.images.tree.image, pos.x, pos.y, this.TILE_WIDTH, this.TILE_HEIGHT);	
			} else if(tile == 3) {
				context.drawImage(this.images.stone.image, pos.x, pos.y, this.TILE_WIDTH, this.TILE_HEIGHT);	
			} else if(tile == 4) {
				context.drawImage(this.images.wood.image, pos.x, pos.y, this.TILE_WIDTH, this.TILE_HEIGHT);	
			} else if(tile == 5) {
				context.drawImage(this.images.War.image, pos.x, pos.y, this.TILE_WIDTH, this.TILE_HEIGHT);	
			} else {

			}			
		}
	}

	for(var i = 0; i < this.entities.length; i++) {
		this.entities[i].render(this.context);
	}

	if(this.starting) {
		context.font = "30pt black bold"
		context.fillText("Start building... create settlements to build a bridge... Good luck", (this.canvas.width/2 - 300) + this.camera.x, 100 + this.camera.y/4);
		context.font = "30pt black bold";
		context.fillText("Level 1", Math.abs(this.startPos.x - 700) + this.camera.x, Math.abs(this.startPos.y - 80) + this.camera.y);
	} else {
		context.font = "30pt black bold";
			context.fillText("Level 1", Math.abs(this.startPos.x - 700) + this.camera.x, Math.abs(this.startPos.y - 80) + this.camera.y);
		context.drawImage(this.images[this.selector.image].image, this.selectedTile.isoX, this.selectedTile.isoY, this.TILE_WIDTH, this.TILE_HEIGHT);
	}
	
};


Game.init();
},{"./level":1,"./light":2,"./person":4,"./util":5,"./vector":6,"./world":7}],4:[function(require,module,exports){
var util = require("./util");

function Person(x, y, building) {
	this.x = x;
	this.y = y;
	this.w = 4;
	this.h = 10;
	this.vY = 0;
	this.vX = 0;
	this.path = [];
	this.type;
	this.building;
	this.atHome = true;
	this.atBridge = false;
	this.currentMoveTo = {x: 0, y: 0};

}

Person.prototype.init = function() {
	
}

Person.prototype.getPath = function(tarLoc) {
	if(!tarLoc) return false;
	this.easystar.findPath(~~this.x/128, ~~this.y/64, dstarLoc.x, tarLoc.y,function(path){
		this.path = path;
		return path;
	}.bind(this));
	this.easystar.calculate();

}

Person.prototype.moveTo = function(tX, tY, callback) {
	//this.getPath({x: tX, y: tY});
	tX += 256;
	tY += 168;
	//tX += Game.camera.x;
	//tY += Game.camera.y;
	var pos = util.moveTo(this.x, this.y, tX, tY, 5);

	this.vX = pos.x;
	this.vY = pos.y;
	if(~~this.x === ~~tX) {
		this.vX = 0;
		this.vY = 0;
		callback();
	} else {
		
	}
	//if()
}

Person.prototype.doAction = function() {
	var res = Game.getResources();
	if(this.type == "build") {
		if(res.stone > 1 && res.wood > 1) {
			if(this.atHome && !this.atBridge) {
				this.moveTo(Game.keyLocs.bridge1.x, Game.keyLocs.bridge1.y, function() {
					//Finished moving
					this.atBridge = !this.atBridge;
					this.atHome = !this.atHome;
					console.log("STOP")
				}.bind(this));
			} else if(!this.atHome && this.atBridge) {
				this.moveTo(Game.keyLocs.bridge1.x + 128, Game.keyLocs.bridge1.y + 64, function() {
					//Finished moving
					this.atBridge = !this.atBridge;
					this.atHome = !this.atHome;
					console.log("STOP")
				}.bind(this));
			}
		}
	}
}

Person.prototype.update = function(dt) {
	
	this.doAction();

	this.x += this.vX;
	this.y += this.vY;	

}

Person.prototype.render = function(ctx) {

	//ctx.fillRect(((this.x * 1.5) + Game.camera.x), (this.y * 2) + Game.camera.y, 10, 20);
	ctx.fillRect((this.x + (Game.camera.x)) + (128), ((this.y) + Game.camera.y) + (Game.canvas.height/2), 10,10);
	
}
	
module.exports = Person;
},{"./util":5}],5:[function(require,module,exports){
Utils = {};

Utils.isometricTransform = function(x, y, w, h, oX, oY) {
	// if(!oX) oX = 0;
	// if(!oY) oY = 0;
	// var isoX = ((x - y) * (w >> 1)) + oX;
	// var isoY = ((x + y) * (h >> 1)) + oY;

	// return {x: isoX, y: isoY};
	var isoX = oX - (y * w >> 1) + (x * w >> 1) - (w >> 1);
    var isoY = oY + (y * h >> 1) + (x * h >> 1);
    return {x: isoX, y: isoY};
};

Utils.objectIso = function(x, y, oX, oY) {
	var isoX = ((x - y)) + oX;
	var isoY = ((x + y) / 2) + oY;

	return {x: isoX, y: isoY};
}

Utils.transformIsometric = function(x, y, w, h, oX, oY) {
	//var x0 = (((x / (w/2)) + (y / (h/2))) / 2);
	//var y0 = (((y / (h/2)) - (x / (h/2))) / 2);
	 var x0 = (2 * y + x) * (w >> 1) + oX;
	 var y0 = (2 * y - x) * (w >> 1) + oY;
	return {x: x0, y: y0};
};

Utils.getTileCoords = function(x, y, w, h, oX, oY) {
	var x1 = x- oX;
	var y1 = y - oY;
	var selectedTile = {};
	selectedTile.x = (y1 + x1/2)/h;
	selectedTile.y = (y1 - x1/2)/h;

	return selectedTile;
};


Utils.canMove = function(nX, nY, array) {
  
  var destTile = this.getTileCoords(nX, nY, 128, 64, array);
  if(array[destTile.x][destTile.y]) {
  	return false;
  } else {
  	return true;	
  }	
}

Utils.changeObject = function(class1, images, selector) {	
	switch (class1) {
		case "stone":
			selector.image = class1;
			selector.type = class1;
			break;
		case "wood":
			selector.image = class1;
			selector.type = class1;
			console.log("WOOD");
			break;
		case "build":
			selector.image = class1;
			selector.type = class1;
			break;
		case "war":
			selector.image = class1;
			selector.type = class1;
			break;
		default:
			break;
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

Utils.moveTo = function(x, y, x0, y0, s) {
  var distanceX = (x0 - x);
  var distanceY = (y0 - y);
  var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  
  distanceX /= distance * s;
  distanceY /= distance * s;
  
  var velX = distanceX;
  var velY = distanceY;

  return {x: velX, y: velY};
}

Utils.init2D = function(width, height) {
	var tempArr = [];
	for(var i = 0; i < height; i++) {
		tempArr[i] = [];
		for(var j = 0; j < width; j++) {	
			
			// var rand = Math.random()*1;
			// if(rand > 0.5) {
			// 	tempArr[i][j] = 0;
			// }  else if(0.3 > rand < 0.8) {
			// 	tempArr[i][j] = 2;
			// } else {
			// 	tempArr[i][j] = 1;
			// }
			tempArr[i][j] = null;
			
			
		}
	}
	return tempArr;
};


module.exports = Utils;
},{}],6:[function(require,module,exports){
function Vector() {

}

module.exports = Vector;
},{}],7:[function(require,module,exports){

var world = [
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,2,2,2,2,2,2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,2,0,0,0,2,2,2,-2,-2,-2,-2,-2,-2,-2,-2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,2,0,0,0,0,2,2,2,2,-2,-2,-2,-2,-2,-2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,2,0,0,0,0,0,0,2,2,-2,-2,-2,-2,-2,-2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,0,0,0,0,0,0,2,2,2,-2,-2,-2,-2,-2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,0,0,0,0,0,0,2,2,2,-2,-2,-2,-2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,0,0,0,0,0,0,2,2,2,-2,-2,-2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,0,0,0,0,0,0,2,2,2,-2,-2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,0,0,0,0,0,0,2,2,2,-2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,0,0,0,0,0,0,2,2,2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,0,0,0,0,0,0,2,2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,0,0,0,0,0,0,2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,0,0,0,0,0,0,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,-2,-2,-2,-2,-2,-2,2,2,0,0,0,0,0,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,2,2,2,0,0,0,0,2,0,0,0,0,0,-2,-2,-2,-2,-2,-2,-2,2,0,0,0,0,0,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,-2,-2,-2,-2,-2,-2,-2,2,0,0,0,0,0,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,-2,-2,-2,-2,-2,-2,-2,2,2,0,0,0,0,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,-2,-2,-2,-2,-2,-2,-2,2,2,0,0,0,0,-2],
  [2,2,0,0,0,0,-2,-2,-2,-2,-2,-2,2,2,0,0,2,0,0,0,0,0,2,0,0,0,0,-2,-2,-2,-2,-2,-2,-2,0,2,0,0,0,0,-2],
  [2,2,2,0,0,0,-2,-2,-2,-2,-2,-2,2,2,0,0,2,2,0,0,2,0,0,0,0,0,0,-2,-2,-2,-2,-2,-2,-2,0,2,0,0,0,0,-2],
  [2,2,2,0,0,0,-2,-2,-2,-2,-2,-2,2,2,0,0,2,2,2,0,0,0,0,0,0,0,0,-2,-2,-2,-2,-2,-2,-2,0,0,0,0,0,0,-2],
  [2,2,2,0,0,0,-2,-2,-2,-2,-2,-2,0,0,0,2,2,2,2,0,0,0,2,0,0,0,0,-2,-2,-2,-2,-2,-2,-2,0,0,0,0,0,0,-2],
  [2,2,2,0,0,0,-2,-2,-2,-2,-2,-2,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,-2,-2,-2,-2,-2,-2,-2,0,0,0,0,0,0,-2],
  [2,2,2,0,0,0,-2,-2,-2,-2,-2,-2,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,-2,-2,-2,-2,-2,-2,-2,2,0,0,0,0,0,-2],
  [2,2,0,0,0,0,-2,-2,-2,-2,-2,-2,2,2,0,2,2,2,2,2,2,0,0,0,0,0,0,-2,-2,-2,-2,-2,-2,-2,2,0,0,0,0,0,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,-2,-2,-2,-2,-2,-2,-2,2,0,0,0,0,2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,2,2,2,2,2,2,2,2,0,0,2,0,0,-2,-2,-2,-2,-2,-2,-2,2,0,0,0,0,2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,0,0,0,0,2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,0,0,0,0,2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,0,0,0,2,2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,0,0,0,2,2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,2,2,2,2,2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,2,2,2,2,2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2]
]

module.exports = world;
},{}]},{},[3]);