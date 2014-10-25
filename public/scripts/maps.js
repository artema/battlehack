function getRoute(points) {
  var request = [];

  for (var i = 0; i < points.length; i++) {
    request.push({
      type: (i == 0) ? 'wayPoint' : 'viaPoint',
      point: [points[i][0], points[i][1]]
    });
  }

  return new Promise(function(resolve, reject) {
    ymaps.route(request).then(function(route){
      resolve(route);
    }, function(e){
      console.error(e);
      reject(e);
    });
  });
}

function getRouteTime(route) {
  return route.getJamsTime();
}

function drawRoute(map, route) {
  map.geoObjects.add(route);
}
