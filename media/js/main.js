(function() {
  function Map(coords, element) {
    var gmap;

    function initializeMap() {
      var latlng = new google.maps.LatLng(coords.lat, coords.lon);
      var myOptions = {
        zoom: 8,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      return new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    }

    gmap = initializeMap();

    return {
      gmap: gmap,
      addPointAt: addPointAt,
      addWifiAt: addWifiAt
    }

  }
})();
