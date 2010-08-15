(function() {
  window.internets = {};

  internets.Map = function(element, options) {
    var gmap;
    options = options || {}
    var coords = options.coordinates || { lat: 44.44, lon: 26.08 };

    function initializeMap() {
      var latlng = new google.maps.LatLng(coords.lat, coords.lon);
      var myOptions = {
        zoom: 13,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      return new google.maps.Map(element, myOptions);
    }

    function addPointAt() {
    }
    
    function addWifiAt() {
    }

    gmap = initializeMap();
    navigator.geolocation.getCurrentPosition(function(pos) {
      var current_location = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      gmap.setCenter(current_location);
    });

    return {
      gmap: gmap,
      addPointAt: addPointAt,
      addWifiAt: addWifiAt
    }

  }

  internets.newNetwork = function(map, point) {
    var poly_editor = new internets.PolyEditor(map, point);
    var anchor = poly_editor.vertices.getAt(0);
    var info_window = new google.maps.InfoWindow({content: "hello world"});
    info_window.open(map, anchor);

    google.maps.event.addListenerOnce(info_window, 'closeclick',
                                      function() { poly_editor.destroy(); });

    function onSubmit(json_data) {
      console.log(json_data);
    }
  }
})();

$(function() {
  var map_element = document.getElementById('map');
  if ( map_element ) {
    var map = new internets.Map(map_element);

    google.maps.event.addListenerOnce(map.gmap, 'click', function(evt) {
      internets.newNetwork(map.gmap, evt.latLng);
    });
  }
});
