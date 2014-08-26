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
	this.caption = this.type + " House";

}

Building.prototype.spawnPeople = function() {
	for(var i = 0; i < this.pCount; i++) {
		var personNew = new person(this.x, this.y, this.type);
		this.people.push(personNew);
	}

	if(this.type == "stone") {
		///this.caption += "5 Stone per visit";
	} else if(this.type == "wood") {
		///this.caption += "5 Wood per visit";
	} else if(this.type == "build") {
		///this.caption += "20 Wood 20 Stone per Build Action";
	}
}

Building.prototype.update  = function(dt) {
	for(var i = 0; i < this.people.length; i++) {
		this.people[i].update(dt);
	}

}

Building.prototype.render = function(ctx) {
	ctx.font = "10px Arial";
	ctx.fillText(this.caption, this.x + Game.camera.x + 50, this.y + Game.camera.y);
	

	
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
    keyLocs: { bridge1: {x: 960, y: 832}, bridge1End: {x: 576, y: 1088}, wood1: {x: 1216, y: 704}, bridge2: { x: -576, y: 1408 }, bridgeCurrent: {x: 0, y: 0}, bridgeCurrentEnd: {x: 0, y: 0}, endGame: {x: -1280, y: 1760}, wood2: {x: 384, y: 1248}, mine1: {x: 896,y: 672}, mine2: {x: 64, y: 1280} },
    entities: [],
    amount: {stone: 0, wood: 0},
    bridge: {l1: 5, l2: 7, l3: 0},
    level: {level: "l1", wood: 10, stone: 10, aWood: 300, aStone: 300, bridgePro: 0, level1: false, level2: false},
    buildingValues: {wood: { wood: -5, stone: 0 }, stone: {stone: -5, wood: 0}, build: {wood:-5, stone: 0}, war: {wood: -5, stone: -5}},
    gameTime: 0,//HOW LONG DID IT TAKE!?!??!?!?! %FUCKING YEARS
    finalCutScene: false,
    startTime: 0,
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

Game.placeBuilding = function(x, y, tX, tY, type) {
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
	this.level.bridgePro += 0.5;

}



Game.renderBridge = function(ctx) {
	
	if(this.level.bridgePro > this.bridge[this.level.level] + 1) {
		if(!this.level.level2) {
			this.level.level = "l2";
			this.level.bridgePro = 0;
			this.keyLocs.bridgeCurrent = this.keyLocs.bridge2;
			this.level.level1 = true;
		}
	
	} 


	if(this.level.level1 && !this.level.level2 && this.level.bridgePro >= this.bridge[this.level.level]) {

			//this.level.level = "l3";
			this.level.level2 = true;
			console.log("LEVEL 3");
		
	}

	var tiles = [];
	var count = this.bridge[this.level.level];
	for(var i = 0; i < count; i++) {
		var oX = (i * 64) + 64;
		var oY = (i * 32) + 32;
		ctx.fillStyle = "black";
		if((i / count) < (this.level.bridgePro / count)) {
			ctx.drawImage(this.images.bridge.image, (((this.keyLocs.bridgeCurrent.x+64) - oX) + this.camera.x) , (((this.keyLocs.bridgeCurrent.y+32) + oY) + this.camera.y), 128, 64);
			ctx.drawImage(this.images.bridge.image, (((this.keyLocs.bridgeCurrent.x) - oX) + this.camera.x) , (((this.keyLocs.bridgeCurrent.y) + oY) + this.camera.y), 128, 64);
			ctx.drawImage(this.images.bridge.image, (((this.keyLocs.bridgeCurrent.x+128) - oX) + this.camera.x) , (((this.keyLocs.bridgeCurrent.y+64) + oY) + this.camera.y), 128, 64);
		} else {

		}
		
	}

	if(this.level.level1) {
		for(var i = 0; i < count; i++) {
			var oX = (i * 64) + 64;
			var oY = (i * 32) + 32;
			ctx.fillStyle = "black";
			ctx.drawImage(this.images.bridge.image, (((this.keyLocs.bridge1.x+64) - oX) + this.camera.x) , (((this.keyLocs.bridge1.y+32) + oY) + this.camera.y), 128, 64);	
			ctx.drawImage(this.images.bridge.image, (((this.keyLocs.bridge1.x) - oX) + this.camera.x) , (((this.keyLocs.bridge1.y) + oY) + this.camera.y), 128, 64);	
			ctx.drawImage(this.images.bridge.image, (((this.keyLocs.bridge1.x+128) - oX) + this.camera.x) , (((this.keyLocs.bridge1.y+64) + oY) + this.camera.y), 128, 64);	

		}
	}
}

Game.init = function() {
	var d = new Date();
	this.startTime = d.getTime();
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
			var x = this.selectedTile.x;
			var y = this.selectedTile.y;
			var tile = this.tiles[~~x][~~y];
			if(tile == -2 || tile  == 2 || tile == undefined) {
			
			} else {

				this.placeBuilding(this.selectedTile.ipx, this.selectedTile.ipy, this.selectedTile.x, this.selectedTile.y, this.selector.type);
				this.amount[this.selector.type]++;
			}

			//this.placeBuilding(this.selectedTile.ipx, this.selectedTile.ipy, this.selectedTile.x, this.selectedTile.y, this.selector.type);
			//this.amount[this.selector.type]++;
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


	this.keyLocs.bridgeCurrent = this.keyLocs.bridge1;

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

	this.images = { tree: {url: "./images/tree.png", image: null}, grass: { url:"./images/grass1.png", image:null}, water: { url:"./images/water.png",image:null}, stone: { url:"./images/stonemason.png",image:null}, wood: { url:"./images/woodchopper.png",image:null}, build: { url:"./images/builder.png",image:null}, war: { url:"./images/garrison.png",image:null}, villager: { url:"./images/villager.png",image:null}, bridge: { url:"./images/bridge.png",image:null}, mine: { url:"./images/mine.png",image:null}, portal: { url:"./images/portal.png",image:null} };
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
			var vel = util.moveTo(this.camera.x, this.camera.y, this.startPos.x, this.startPos.y, 12);
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

	if(this.finalCutScene) {
		this.goodGame("");
	}

	for(var i = 0; i < this.entities.length; i++) {
		this.entities[i].update(dt);
	}

	if(this.level.stone == 0 && this.amount.stone === 0) {
		this.endGame("You ran out of stone.. oh no :-(");
	} else if(this.level.wood == 0 && this.amount.wood === 0) {
		this.endGame("You ran out of wood.. oh no :-(");
	}

	if(this.level.wood < 0) {
		this.level.wood = 0;
	} else if(this.level.stone < 0) {
		this.level.stone = 0;
	}

};


Game.endGame = function(why) {
	this.running = true;
	this.context.fillStyle = "black";
	this.context.fillRect(0,0,this.canvas.width, this.canvas.height);
	
	this.context.fillStyle = "rgba(255,255,255,0.5)";
	util.roundRect(this.context, 10, 10, 500, 400, 2, true, true);

	this.context.fillStyle = "white";
	this.context.font="20px Calibri";
	this.context.fillText("Sadly you failed." + why, 10, 100);
	this.context.fillText( "To try again please refresh the page", 10, 200);

}


Game.goodGame = function(why) {
	this.running = true;
	this.context.fillStyle = "black";
	this.context.fillRect(0,0,this.canvas.width, this.canvas.height);
	
	this.context.fillStyle = "rgba(255,255,255,0.5)";
	util.roundRect(this.context, 10, 10, 1000, 400, 2, true, true);

	this.context.fillStyle = "white";
	this.context.font="20px Calibri";
	this.context.fillText("Well Done! You built the two bridges required to reach the portals of mystery!." + why, 10, 100);
	
	var d = new Date();
	var t = d.getTime();
	var diff = t - this.startTime;
	var diffS = diff/60;
	this.context.fillText( "You took a total time of: " + diffS + " Seconds", 10, 200);


}

var aa = 1;
Game.render = function(dt) { 
  	var context = this.context;
  	context.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
  	context.fillStyle = "rgba(0, 148, 255, 0.5)";
  	context.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
	
	

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
			} else if(tile == 6) {
				context.drawImage(this.images.mine.image, pos.x, pos.y, this.TILE_WIDTH, this.TILE_HEIGHT);	
			} else if(tile == 7) {
				context.drawImage(this.images.portal.image, pos.x, pos.y, this.TILE_WIDTH, this.TILE_HEIGHT);	
			}
		}
	}

	this.renderBridge(context);

	context.fillStyle = "rgba(255,255,255,0.5)";
	util.roundRect(this.context, 10, 10, 500, 100, 2, true, true);

	context.fillStyle = "white";

	for(var i = 0; i < this.entities.length; i++) {
		this.entities[i].render(this.context);
	}

	if(this.starting) {
		context.font = "900 30px Arial"
		
		context.fillText("Your aim is to reach the PORTALS... use WSAD to look around to find it!", (this.canvas.width/2 - 300) + this.camera.x, 50 + this.camera.y/4);
		context.fillText("Start building... mine wood and stone then place builders to begin building a bridge", (this.canvas.width/2 - 300) + this.camera.x, 125 + this.camera.y/4);
		context.fillText("After you build the first you will need to build a second to reach your goal.", (this.canvas.width/2 - 300) + this.camera.x, 200 + this.camera.y/4);
		
		context.font = "900 30px Arial";
		context.fillText("Level 1", Math.abs(this.startPos.x - 700) + this.camera.x, Math.abs(this.startPos.y) + this.camera.y);
		context.fillText("Level 2", (this.startPos.x + 450) + this.camera.x, Math.abs(this.startPos.y) + this.camera.y);
	
		context.fillText("Wood: " + this.level.wood, 20, 50);
		context.fillText("Stone: " + this.level.stone, 20, 100);
		context.fillText("Bridge: " + this.level.bridgePro.toFixed(1), 250, 75);
	} else {
		context.font = "900 30px Arial";
		context.fillText("Level 1", Math.abs(this.startPos.x - 700) + this.camera.x, Math.abs(this.startPos.y) + this.camera.y);
		context.fillText("Level 2", (this.startPos.x + 450) + this.camera.x, Math.abs(this.startPos.y) + this.camera.y);


		context.font = "900 30px Arial";
		
		
		context.fillText("Wood: " + this.level.wood, 20, 50);
		context.fillText("Stone: " + this.level.stone, 20, 100);
		context.fillText("Bridge: " + this.level.bridgePro.toFixed(1), 250, 75);
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
	this.atMine = false;
	this.bridgeEnd = false;
	this.bridgeEnd1 = false;
	this.building = {x: x, y: y};
	this.caption = this.type;
	this.speed = util.randRange(10,16);


	this.posTime = 10000;
	this.timeLimit = util.randRange(2000, 5000);

}

Person.prototype.init = function() {
	
}


Person.prototype.moveTo = function(tX, tY, callback) {
	this.vX += 64;
	this.vY += 32;
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
		if(res.stone >= 0 && res.wood >= 0) {
			if(this.atHome && !this.atBridge) {
				if(this.posTime > this.timeLimit) {
					
					if((Game.level.level1 && !Game.level.level2 && this.building.y < Game.keyLocs.bridge1.y)) {//IF LEVEL 2 AND SECTION1 MOVE ACROSS BRIDGE
						this.moveTo(Game.keyLocs.bridge1.x + 128, Game.keyLocs.bridge1.y + 64, function() {
							this.bridgeEnd = true;
						
						}.bind(this));
						
						if(this.bridgeEnd) {
									this.moveTo(Game.keyLocs.bridgeCurrent.x + 128, Game.keyLocs.bridgeCurrent.y + 64, function() {
									//ACROSS 1ST BRIDGE CONTINUE
									this.bridgeEnd != this.bridgeEnd;
									this.atBridge = !this.atBridge;
									this.atHome = !this.atHome;
									console.log("STOP");
									if(res.stone > 1 && res.wood > 1) {
										Game.changeResources({stone: -20, wood: -20});
									} else {

									}
							
									Game.buildBridge();
									this.posTime = 0;
							}.bind(this));
						}
					} else if(Game.level.level2 && this.building.y < Game.keyLocs.bridge2.y) {
						this.moveTo(Game.keyLocs.bridge2.x + 128, Game.keyLocs.bridge2.y + 64, function() {
							this.bridgeEnd1 = true;
						
						}.bind(this));

						if(this.bridgeEnd1) {
							this.moveTo(Game.keyLocs.endGame.x + 128, Game.keyLocs.endGame.y + 64, function() {
								this.font = "100px Arial"
								this.caption = "YAY THE PORTAL HAS BEEN FOUND";
							}.bind(this));
						}

					} else {
						this.moveTo(Game.keyLocs.bridgeCurrent.x + 128, Game.keyLocs.bridgeCurrent.y + 64, function() {
							//Finished moving
							this.atBridge = !this.atBridge;
							this.atHome = !this.atHome;
							console.log("STOP")
							this.posTime = 0;
							if(res.stone > 1 && res.wood > 1) {
								Game.changeResources({stone: -20, wood: -20});
							} else {

							}
						
						Game.buildBridge();
						}.bind(this));
					}
				
				} else {

				}
			} else if(!this.atHome && this.atBridge) {
				if(this.posTime > this.timeLimit) {
					this.moveTo(this.building.x, this.building.y, function() {
						//Finished moving
						this.atBridge = !this.atBridge;
						this.atHome = !this.atHome;
						
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
						
						if(this.building.y < Game.keyLocs.bridge1.y + 128) { //SHITTY NUMBER 1 SPPOT
							this.moveTo((Game.keyLocs.wood1.x) + Math.random()*64, (Game.keyLocs.wood1.y) + Math.random()*32, function() {
								//Finished moving
								this.atTree = !this.atTree;
								this.atHome = !this.atHome;
								console.log("STOP")
								this.posTime = 0;
							}.bind(this));
						} else { //CRAPPY NUMBER 2 SPOT
							this.moveTo((Game.keyLocs.wood2.x) + Math.random()*64, (Game.keyLocs.wood2.y) + Math.random()*32, function() {
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
								Game.changeResources({stone: 0, wood: 5});
								console.log("STOP");
								this.posTime = 0;
							}.bind(this));
						} else {

						}
		}
	} else if(this.type == "stone") {

				if(this.atHome && !this.atMine) {
					if(this.posTime > this.timeLimit) {
						
						if(this.building.y < Game.keyLocs.bridge1.y + 128) { //SHITTY NUMBER 1 SPPOT
							this.moveTo((Game.keyLocs.mine1.x) + Math.random()*64, (Game.keyLocs.mine1.y) + Math.random()*32, function() {
								//Finished moving
								this.atMine = !this.atMine;
								this.atHome = !this.atHome;
								console.log("STOP")
								this.posTime = 0;
							}.bind(this));
						} else { //CRAPPY NUMBER 2 SPOT
							this.moveTo((Game.keyLocs.mine2.x) + Math.random()*64, (Game.keyLocs.mine2.y) + Math.random()*32, function() {
								//Finished moving
								this.atMine = !this.atMine;
								this.atHome = !this.atHome;
								console.log("STOP")
								this.posTime = 0;
							}.bind(this));
						}
							
						} else {
							
						}
					} else if(!this.atHome && this.atMine) {
						if(this.posTime > this.timeLimit) {
							this.moveTo(this.building.x, this.building.y, function() {
								//Finished moving
								this.atMine = !this.atMine;
								this.atHome = !this.atHome;
								Game.changeResources({stone: 5, wood: 0});
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
	ctx.font = "10px Arial";
	ctx.fillText(this.caption, this.x + Game.camera.x - 10, this.y + Game.camera.y);
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

Utils.roundRect = function(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }        
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
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,2,0,1,1,2,2,2,-2,-2,-2,-2,-2,-2,-2,-2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,2,0,0,1,1,2,2,2,2,-2,-2,-2,-2,-2,-2,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,2,0,0,1,1,0,0,2,2,-2,-2,-2,-2,-2,-2,-2],
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
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,2,0,0,1,1,0,0,0,0,0,0,0,0,-2,-2,-2,-2,-2,-2,-2,2,2,0,0,0,0,-2],
  [-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,-2,2,2,0,0,0,1,1,0,0,0,0,0,0,0,0,-2,-2,-2,-2,-2,-2,-2,2,2,0,0,0,0,-2],
  [2,2,0,6,6,0,-2,-2,-2,-2,-2,-2,2,2,0,0,2,0,0,0,0,0,2,0,0,0,0,-2,-2,-2,-2,-2,-2,-2,0,2,0,0,0,0,-2],
  [2,2,2,0,0,0,-2,-2,-2,-2,-2,-2,2,2,0,0,2,2,0,0,2,0,0,0,0,0,0,-2,-2,-2,-2,-2,-2,-2,0,2,0,0,0,0,-2],
  [2,2,2,0,0,0,-2,-2,-2,-2,-2,-2,2,2,0,0,2,2,2,6,6,0,0,0,0,0,0,-2,-2,-2,-2,-2,-2,-2,0,7,7,7,0,0,-2],
  [2,2,2,0,0,0,-2,-2,-2,-2,-2,-2,0,0,0,2,2,2,2,6,6,0,2,0,0,0,0,-2,-2,-2,-2,-2,-2,-2,0,7,7,7,0,0,-2],
  [2,2,2,0,0,0,-2,-2,-2,-2,-2,-2,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,-2,-2,-2,-2,-2,-2,-2,0,7,7,7,0,0,-2],
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