
function createTrafficControl(map) {
  var controlDiv = document.createElement('DIV');

  $(controlDiv).addClass('gmap-control-container')
               .addClass('gmnoprint');

  var controlUI = document.createElement('DIV');
  $(controlUI).addClass('gmap-control')
              .addClass('gmap-control-active');
  $(controlUI).text('Traffic');
  $(controlDiv).append(controlUI);

  var trafficLayer = new google.maps.TrafficLayer();

  google.maps.event.addDomListener(controlUI, 'click', function() {
      if (typeof trafficLayer.getMap() == 'undefined' || trafficLayer.getMap() === null) {
          $(controlUI).addClass('gmap-control-active');
          trafficLayer.setMap(map);
      } else {
          trafficLayer.setMap(null);
          $(controlUI).removeClass('gmap-control-active');
      }
  });

  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);

  trafficLayer.setMap(map);
}
