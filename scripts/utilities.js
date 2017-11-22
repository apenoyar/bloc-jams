var points = document.getElementsByClassName('point');

var forEach = function(points, callbackFunction) {
  for (var i = 0; i < points.length; i++) {
    callbackFunction(points[i]);
  }
}
