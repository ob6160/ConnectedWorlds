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

Utils.transformIsometric = function(x, y, w, h, oX, oY) {
	//var x0 = (((x / (w/2)) + (y / (h/2))) / 2);
	//var y0 = ((y / (h/2)) - (x / (h/2))) / 2;
	 var x0 = (2 * y + x) * (w >> 1) + oX;
	 var y0 = (2 * y - x) * (w >> 1) + oY;
	return {x: x0, y: y0};
};

Utils.getTileCoords = function(x, y, w, h) {
	var x0 = ~~(x / (w));
	var y0 = ~~(y / (h));
	return {x: x0, y: y0};
};


Utils.canMove = function(nX, nY, array) {
  
  var destTile = this.getTileCoords(nX, nY, 128, 64, array);
  if(array[destTile.x][destTile.y]) {
  	return false;
  } else {
  	return true;	
  }
  

	
}

Utils.getMousePos = function(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
};

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

window.timeStamp = function () {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

Utils.init2D = function(width, height) {
	var tempArr = [];
	for(var i = 0; i < height; i++) {
		tempArr[i] = [];
		for(var j = 0; j < width; j++) {	
			
			if(j % 10 == 0 || i % 10 == 0) {
				tempArr[i][j] = null;

			} else {
				tempArr[i][j] = 0;
			}
			
		}
	}
	return tempArr;
};


module.exports = Utils;