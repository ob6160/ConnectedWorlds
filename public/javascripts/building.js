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
		var personNew = new person(this.x+128, this.y + 64, this.type);
		this.people.push(personNew);
	}
}