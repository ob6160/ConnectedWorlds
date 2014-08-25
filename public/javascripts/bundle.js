(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var person = require('./person');

function Building(x, y, type) {
	this.x = x;
	this.y = y;

	//In case of attack
	this.health = 100;

	//People contained by this building
	this.people = [];

	this.pCount = 1;
	this.type = type;

}

Building.prototype.spawnPeople = function() {
	for(var i = 0; i < this.pCount; i++) {
		var personNew = new person(this.x, this.y, this.type);
		this.people.push(personNew);
	}
}

Building.prototype.update  = function(dt) {
	for(var i = 0; i < this.people.length; i++) {
		this.people[i].update(dt);
	}
}

Building.prototype.render = function(ctx) {
	ctx.drawImage(Game.images[this.type].image, this.x + Game.camera.x, this.y + Game.camera.y, 128, 64);
	for(var i = 0; i < this.people.length; i++) {
		this.people[i].render(ctx);
	}
	

}

module.exports = Building;
},{"./person":5}],2:[function(require,module,exports){
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
},{"./util":6}],3:[function(require,module,exports){
function Light() {

}

module.exports = Light;
},{}],4:[function(require,module,exports){
var light  = require('./light'),
level = require('./level'),
vector = require('./vector'),
util = require('./util'),
world = require('./world'),
person = require("./person"),
building = require("./building");

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
    selectedTile: {x: 0, y:0, noCam: {x: 0, y: 0}},
    easystar: new EasyStar.js(),
    selector: { image: "stone" },
    starting: true,
    startPos: {x: -402, y: -475},
    keyLocs: { bridge1: {x: 960, y: 832}, wood1: {x: 1216, y: 704} },
    entities: [],
    bridge: {l1: 6, l2: 7},
    level: {level: "l1", wood: 100, stone: 100, aWood: 300, aStone: 300, bridgePro: 0},
    buildingValues: {wood: { wood: -5, stone: 0 }, stone: {stone: -5, wood: 0}, build: {wood:-5, stone: 0}, war: {wood: -5, stone: -5}},
};

Game.getResources = function() {
	
	if(!this.level) return false;
	return this.level;
}

Game.setResources = function(res) {
	if(!res) return false;
	this.level = res;
	return true;
}

Game.changeResources = function(res) {
	if(!res) return false;
	this.level.wood += res.wood;
	this.level.stone += res.stone;

	return true;
}

Game.placeBuilding = function(x, y, type) {
	var newBuilding = new building(x, y, type);
	newBuilding.spawnPeople();
	var resNeeded = this.getBuildValue(type);
	this.changeResources(resNeeded);
	this.entities.push(newBuilding);
}

Game.getBuildValue = function(type) {
	return this.buildingValues[type];
}

Game.buildBridge = function() {
	//Every villager increases by 5%
	this.level.bridgePro += 0.05;

}



Game.renderBridge = function(ctx) {
	var tiles = [];
	var count = this.bridge[this.level.level];
	for(var i = 0; i < count; i++) {
		var oX = (i * 64) + 64;
		var oY = (i * 32) + 32;
		ctx.fillStyle = "black";
		if((i / count) < (this.level.bridgePro / count)) {
			ctx.drawImage(this.images.bridge.image, (((this.keyLocs.bridge1.x+64) - oX) + this.camera.x) , (((this.keyLocs.bridge1.y+32) + oY) + this.camera.y), 128, 64);
		} else {

		}
		
	}
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
		this.selectedTile.ipx = selectedTileIso.x - Game.camera.x;
		this.selectedTile.ipy = selectedTileIso.y - Game.camera.y;

	}.bind(this));
	this.canvas.addEventListener('click', function(e) {
		if(util.canAffordObject(this.selector.type)) {
			this.placeBuilding(this.selectedTile.ipx , this.selectedTile.ipy, this.selector.type);	
		}
		
	}.bind(this));
	$(document).keydown(function (e) {
	    this.keys[e.keyCode] = true;
	}.bind(this));

	$(document).keyup(function (e) {
	    delete this.keys[e.keyCode];
	}.bind(this));

	var images = this.images;
	var selector = this.selector;
	$(".select img").on("click", function(e) {
		var class1 = $(this).attr("class");
		util.changeObject(class1, images, selector);

	});
	util.changeObject("wood", images, selector);
	// var testPerson = new person(960, 832, null);
	// testPerson.type = "build";
	// this.entities.push(testPerson);

	/* Create Game Map */

	this.tiles = world;
	// this.easystar.setGrid(this.tiles);
	// this.easystar.setAcceptableTiles([0]);
	
	this.context.imageSmoothingEnabled = false;
	
	/* Create Time Canvas */
	/*this.timeCanvas = document.createElement("canvas");
	this.timeContext = this.timeCanvas.getContext("2d");
	this.timeCanvas.width = this.canvas.width;
	this.timeCanvas.height = this.canvas.height;
	this.timeCanvas.fillRect()*/

	this.images = { tree: {url: "./images/tree.png", image: null}, grass: { url:"./images/grass1.png", image:null}, water: { url:"./images/water.png",image:null}, stone: { url:"./images/stonemason.png",image:null}, wood: { url:"./images/woodchopper.png",image:null}, build: { url:"./images/builder.png",image:null}, war: { url:"./images/garrison.png",image:null}, villager: { url:"./images/villager.png",image:null}, bridge: { url:"./images/bridge.png",image:null} };
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

	
	if(this.starting) {
		var vel = util.moveTo(this.camera.x, this.camera.y, this.startPos.x, this.startPos.y, 3);
		if(~~this.camera.x === ~~this.startPos.x) {
			this.starting = !this.starting;
		} else {
			this.camera.x += vel.x;
			this.camera.y += vel.y;
		}
		} else {
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
	}
	for(var i = 0; i < this.entities.length; i++) {
		this.entities[i].update(dt);
	}
};


var aa = 1;
Game.render = function(dt) { 
  	var context = this.context;
  	context.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
  	context.fillStyle = "rgb(0, 148, 255)";
  	context.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
	
	this.renderBridge(context);

	for(var y = 0; y < this.tiles.length; y++) {
		for(var x = 0; x < this.tiles[y].length	; x++) {
			
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

	context.fillStyle = "white";

	for(var i = 0; i < this.entities.length; i++) {
		this.entities[i].render(this.context);
	}

	if(this.starting) {
		context.font = "30pt black bold"
		context.fillText("Start building... create settlements to build a bridge... Good luck", (this.canvas.width/2 - 300) + this.camera.x, 100 + this.camera.y/4);
		context.font = "30pt black bold";
		context.fillText("Level 1", Math.abs(this.startPos.x - 700) + this.camera.x, Math.abs(this.startPos.y - 80) + this.camera.y);
		context.fillText("Wood: " + this.level.wood, Math.abs(this.startPos.x - 750) + this.camera.x, Math.abs(this.startPos.y - 20) + this.camera.y);
		context.fillText("Stone: " + this.level.stone, Math.abs(this.startPos.x - 550) + this.camera.x, Math.abs(this.startPos.y - 20) + this.camera.y);
		context.fillText("Bridge: " + this.level.bridgePro.toFixed(2), Math.abs(this.startPos.x - 350) + this.camera.x, Math.abs(this.startPos.y - 20) + this.camera.y);
	} else {
		context.font = "30pt black bold";
		context.fillText("Level 1", Math.abs(this.startPos.x - 700) + this.camera.x, Math.abs(this.startPos.y - 80) + this.camera.y);

		context.font = "30pt black bold";
		context.fillText("Wood: " + this.level.wood, Math.abs(this.startPos.x - 750) + this.camera.x, Math.abs(this.startPos.y - 20) + this.camera.y);
		context.fillText("Stone: " + this.level.stone, Math.abs(this.startPos.x - 550) + this.camera.x, Math.abs(this.startPos.y - 20) + this.camera.y);
		context.fillText("Bridge: " + this.level.bridgePro.toFixed(2), Math.abs(this.startPos.x - 350) + this.camera.x, Math.abs(this.startPos.y - 20) + this.camera.y);
		context.drawImage(this.images[this.selector.image].image, this.selectedTile.isoX, this.selectedTile.isoY, this.TILE_WIDTH, this.TILE_HEIGHT);
	}

	
	
};


Game.init();
},{"./building":1,"./level":2,"./light":3,"./person":5,"./util":6,"./vector":7,"./world":8}],5:[function(require,module,exports){
var util = require("./util");

function Person(x, y, type) {
	this.x = x;
	this.y = y;
	this.w = 4;
	this.h = 10;
	this.vY = 0;
	this.vX = 0;
	this.path = [];
	this.type = type;

	this.atHome = true;
	this.atBridge = false;
	this.atTree = false;


	this.building = {x: x, y: y};

	this.speed = util.randRange(10,16);


	this.posTime = 0;
	this.timeLimit = util.randRange(2000, 6000);

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
	var pos = util.moveTo(this.x, this.y, tX, tY, this.speed);

	this.vX = pos.x;
	this.vY = pos.y;
	if(~~this.x === ~~tX) {
		this.vX = 0;
		this.vY = 0;
		callback();
	} else {
		
	}
}

Person.prototype.doAction = function() {
	this.posTime++;
	var res = Game.getResources();
	if(this.type == "build") {
		if(res.stone > 1 && res.wood > 1) {
			if(this.atHome && !this.atBridge) {
				if(this.posTime > this.timeLimit) {
						this.moveTo(Game.keyLocs.bridge1.x + 128, Game.keyLocs.bridge1.y + 64, function() {
						//Finished moving
						this.atBridge = !this.atBridge;
						this.atHome = !this.atHome;
						console.log("STOP")
						this.posTime = 0;
					}.bind(this));
				} else {

				}
			} else if(!this.atHome && this.atBridge) {
				if(this.posTime > this.timeLimit) {
					this.moveTo(this.building.x, this.building.y, function() {
						//Finished moving
						this.atBridge = !this.atBridge;
						this.atHome = !this.atHome;
						Game.changeResources({stone: -10, wood: -10});
						Game.buildBridge();
						console.log("STOP");
						this.posTime = 0;
					}.bind(this));
				} else {

						}
					}
				} else {
					//NOT ENOUGH SHIT
					this.moveTo(this.building.x, this.building.y, function() {
						//Finished moving
						this.atBridge = !this.atBridge;
						this.atHome = !this.atHome;
						this.posTime = 0;
					}.bind(this));
				}
			} else if(this.type == "wood") {

				if(this.atHome && !this.atTree) {
					if(this.posTime > this.timeLimit) {
						if(Game.level.wood > 0) {
							this.moveTo((Game.keyLocs.wood1.x) + Math.random()*64, (Game.keyLocs.wood1.y) + Math.random()*32, function() {
								//Finished moving
								this.atTree = !this.atTree;
								this.atHome = !this.atHome;
								console.log("STOP")
								this.posTime = 0;
							}.bind(this));
						}
					
						} else {

						}
					} else if(!this.atHome && this.atTree) {
						if(this.posTime > this.timeLimit) {
							this.moveTo(this.building.x, this.building.y, function() {
								//Finished moving
								this.atTree = !this.atTree;
								this.atHome = !this.atHome;
								Game.changeResources({stone: 0, wood: 10});
								console.log("STOP");
								this.posTime = 0;
							}.bind(this));
						} else {

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
	
	ctx.drawImage(Game.images.villager.image, this.x + Game.camera.x, this.y + Game.camera.y, 10, 20);

	
}
	
module.exports = Person;
},{"./util":6}],6:[function(require,module,exports){
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
};

Utils.canAffordObject = function(type) {
	var res = Game.getResources();
	if(type == "wood" && res.wood >= 5) {
		return true;
	} else if(type == "stone" && res.stone >= 5) {
		return true;
	} else if(type == "build" && res.wood >= 5) {
		return true;
	} else if(type == "war" && res.stone >= 5 && res.wood >= 5) {
		return true;
	} else {
		return false;
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

Utils.randRange = function(min, max) {
	 return Math.random() * (max - min) + min;
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
},{}],7:[function(require,module,exports){
function Vector() {

}

module.exports = Vector;
},{}],8:[function(require,module,exports){

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
},{}]},{},[4]);