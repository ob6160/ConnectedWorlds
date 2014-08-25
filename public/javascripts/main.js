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
    level: {wood: 100, stone: 100},
    buildingValues: {wood: { wood: -5, stone: 0 }, stone: {stone: -5}, build: {wood:-5}, war: {wood: -5, stone: -5}},
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
	console.log(resNeeded);
	this.changeResources(resNeeded);
	this.entities.push(newBuilding);
}

Game.getBuildValue = function(type) {
	return this.buildingValues[type];
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

	this.images = { tree: {url: "./images/tree.png", image: null}, grass: { url:"./images/grass1.png", image:null}, water: { url:"./images/water.png",image:null}, stone: { url:"./images/stonemason.png",image:null}, wood: { url:"./images/woodchopper.png",image:null}, build: { url:"./images/builder.png",image:null}, war: { url:"./images/garrison.png",image:null}, villager: { url:"./images/villager.png",image:null} };
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
	} else {
		context.font = "30pt black bold";
		context.fillText("Level 1", Math.abs(this.startPos.x - 700) + this.camera.x, Math.abs(this.startPos.y - 80) + this.camera.y);

		context.font = "30pt black bold";
		context.fillText("Wood: " + this.level.wood, Math.abs(this.startPos.x - 750) + this.camera.x, Math.abs(this.startPos.y - 20) + this.camera.y);
		context.fillText("Stone: " + this.level.stone, Math.abs(this.startPos.x - 550) + this.camera.x, Math.abs(this.startPos.y - 20) + this.camera.y);

		context.drawImage(this.images[this.selector.image].image, this.selectedTile.isoX, this.selectedTile.isoY, this.TILE_WIDTH, this.TILE_HEIGHT);
	}
	
};


Game.init();