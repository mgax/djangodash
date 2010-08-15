(function() {
  function Map(element, options) {
    var gmap;
    options = options || {}
    var coords = options.coordinates || { lat: 23, lon: 44 };

    function initializeMap() {
      var latlng = new google.maps.LatLng(coords.lat, coords.lon);
      var myOptions = {
        zoom: 8,
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


  var map_element = document.getElementById('map');
  if ( map_element ) {
    var map = new Map(map_element);
    /*setTimeout(function() {
        var center = map.gmap.getCenter();
        createPolyEditor(map.gmap, center.lat(), center.lng());
    }, 500); /* */
  }
})();
