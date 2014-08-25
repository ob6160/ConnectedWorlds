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