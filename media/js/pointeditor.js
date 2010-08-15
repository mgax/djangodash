(function() {
  internets.PointEditor = function(map, point) {
    var coord = new google.maps.LatLng(point.lat(), point.lng());
    var marker = new google.maps.Marker({ map: map, position: coord,
                                          draggable: true });

    marker.setIcon(internets.icon_normal);

    // change icon on mouseover and mouseout
    google.maps.event.addListener(marker, 'mouseover', function(evt) {
      marker.setIcon(internets.icon_hover); });
    google.maps.event.addListener(marker, 'mouseout', function(evt) {
      marker.setIcon(internets.icon_normal); });

    return {
      marker: marker,
      position: function() {
        return { lat: marker.getPosition().lat(), lon: marker.getPosition().lng() };
      },
      destroy: function() {
        marker.setMap(null);
      }
    };

  }

})();
