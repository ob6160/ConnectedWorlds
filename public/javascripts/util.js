Utils = {};

Utils.isometricTransform = function(x, y, w, h) {
	x += 160;
	var isoX = x - y;
	var isoY = (x + y) / 2;
	return {x: isoX, y: isoY};
};

Utils.transformIsometric = function(x, y, w, h) {
	x += 160;
	var x0 = (2 * y + x) / 2;
	var y0 = (2 * y - x) / 2;
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
	for(var i = 0; i < width; i++) {
		tempArr[i] = [];
		for(var j = 0; j < height; j++) {
			tempArr[i][j] = 0;
		}
	}
	return tempArr;
};


module.exports = Utils;