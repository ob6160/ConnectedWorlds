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
	this.level.bridgePro += 0.2;

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
		
		context.fillText("Your aim is to reach the star... use WSAD to look around to find it!", (this.canvas.width/2 - 300) + this.camera.x, 50 + this.camera.y/4);
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