var person = require('./person');

function Building(x, y, type) {
	this.x = x;
	this.y = y;

	//In case of attack
	this.health = 100;

	//People contained by this building
	this.people = [];

	this.pCount = 5;
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