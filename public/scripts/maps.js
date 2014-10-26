function getRoute(points) {
  var request = [];

  for (var i = 0; i < points.length; i++) {
    request.push({
      type: (i == 0 || i == points.length - 1) ? 'wayPoint' : 'viaPoint',
      point: [points[i][0], points[i][1]]
    });
  }

  return new Promise(function(resolve, reject) {
    ymaps.route(request).then(function(route){
      resolve(route);
    }, console.error);
  });
}

function getRouteTime(route) {
  return route.getJamsTime();
}

function drawRoute(map, route) {
  map.geoObjects.add(route);
}

function clearRoute(map, route) {
  map.geoObjects.remove(route);
}

function searchRoute(from, to) {
  var request = [
    {
      type: 'wayPoint',
      point: from
    },
    {
      type: 'wayPoint',
      point: to
    }
  ];

  return new Promise(function(resolve, reject) {
    ymaps.route(request, { mapStateAutoApply: true }).then(function(route){
      resolve(route);
    }, reject);
  });
}
