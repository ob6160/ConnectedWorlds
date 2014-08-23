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