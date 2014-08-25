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