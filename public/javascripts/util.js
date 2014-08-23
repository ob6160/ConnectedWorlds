Utils = {};

Utils.isometricTransform = function(x, y, w, h, oX, oY) {
	if(!oX) oX = 0;
	if(!oY) oY = 0;
	var isoX = ((x - y) * (w >> 1)) + oX;
	var isoY = ((x + y) * (h >> 1)) + oY;

	return {x: isoX, y: isoY};
};

Utils.objectIso = function(x, y, oX, oY) {
	var isoX = ((x - y)) + oX;
	var isoY = ((x + y) / 2) + oY;

	return {x: isoX, y: isoY};
}

Utils.transformIsometric = function(x, y, w, h) {

	var x0 = (2 * y + x) * (w >> 1);
	var y0 = (2 * y - x) * (w >> 1);
	return {x: x0, y: y0};
};

Utils.getTileCoords = function(x, y, w, h) {
	var x0 = Math.floor(x / w);
	var y0 = Math.floor(y / h);
	return {x: x0, y: y0};
};

Utils.getMousePos = function(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
};

Utils.init2D = function(width, height) {
	var tempArr = [];
	for(var i = 0; i < height; i++) {
		tempArr[i] = [];
		for(var j = 0; j < width; j++) {
			tempArr[i][j] = 0;
			if(Math.random()*1 < 0.5) {
				tempArr[i][j] = 1;
			}
			
		}
	}
	return tempArr;
};


module.exports = Utils;