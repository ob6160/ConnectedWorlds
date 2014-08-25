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
	tX += 64;
	tY += 32;
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
				this.moveTo(Game.keyLocs.bridge1.x - 64, Game.keyLocs.bridge1.y - 32, function() {
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

	ctx.fillRect((this.x * 1.5) + Game.camera.x, (this.y * 2) + Game.camera.y, 20, 20);
	
}
	
module.exports = Person;