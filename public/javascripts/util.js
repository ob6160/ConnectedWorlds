Utils = {};

Utils.isometricTransform = function(x, y, w, h, oX, oY) {
	// if(!oX) oX = 0;
	// if(!oY) oY = 0;
	// var isoX = ((x - y) * (w >> 1)) + oX;
	// var isoY = ((x + y) * (h >> 1)) + oY;

	// return {x: isoX, y: isoY};
	var isoX = oX - (y * w >> 1) + (x * w >> 1) - (w >> 1);
    var isoY = oY + (y * h >> 1) + (x * h >> 1);
    return {x: isoX, y: isoY};
};

Utils.objectIso = function(x, y, oX, oY) {
	var isoX = ((x - y)) + oX;
	var isoY = ((x + y) / 2) + oY;

	return {x: isoX, y: isoY};
}

Utils.transformIsometric = function(x, y, w, h, oX, oY) {
	//var x0 = (((x / (w/2)) + (y / (h/2))) / 2);
	//var y0 = (((y / (h/2)) - (x / (h/2))) / 2);
	 var x0 = (2 * y + x) * (w >> 1) + oX;
	 var y0 = (2 * y - x) * (w >> 1) + oY;
	return {x: x0, y: y0};
};

Utils.getTileCoords = function(x, y, w, h, oX, oY) {
	var x1 = x- oX;
	var y1 = y - oY;
	var selectedTile = {};
	selectedTile.x = (y1 + x1/2)/h;
	selectedTile.y = (y1 - x1/2)/h;

	return selectedTile;
};


Utils.canMove = function(nX, nY, array) {
  
  var destTile = this.getTileCoords(nX, nY, 128, 64, array);
  if(array[destTile.x][destTile.y]) {
  	return false;
  } else {
  	return true;	
  }	
}

Utils.changeObject = function(class1, images, selector) {	
	switch (class1) {
		case "stone":
			selector.image = class1;
			selector.type = class1;
			break;
		case "wood":
			selector.image = class1;
			selector.type = class1;
			console.log("WOOD");
			break;
		case "build":
			selector.image = class1;
			selector.type = class1;
			break;
		case "war":
			selector.image = class1;
			selector.type = class1;
			break;
		default:
			break;
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

Utils.moveTo = function(x, y, x0, y0, s) {
  var distanceX = (x0 - x);
  var distanceY = (y0 - y);
  var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  
  distanceX /= distance * s;
  distanceY /= distance * s;
  
  var velX = distanceX;
  var velY = distanceY;

  return {x: velX, y: velY};
}

Utils.init2D = function(width, height) {
	var tempArr = [];
	for(var i = 0; i < height; i++) {
		tempArr[i] = [];
		for(var j = 0; j < width; j++) {	
			
			// var rand = Math.random()*1;
			// if(rand > 0.5) {
			// 	tempArr[i][j] = 0;
			// }  else if(0.3 > rand < 0.8) {
			// 	tempArr[i][j] = 2;
			// } else {
			// 	tempArr[i][j] = 1;
			// }
			tempArr[i][j] = null;
			
			
		}
	}
	return tempArr;
};


module.exports = Utils;