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