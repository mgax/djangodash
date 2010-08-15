(function() {
  internets.WifiPoint = function(map, point) {
    var icon_url_normal = MEDIA_URL+"images/vertex-normal.png";
    var icon_url_hover = MEDIA_URL+"images/vertex-hover.png";
    var icon_normal = new google.maps.MarkerImage(icon_url_normal);
    var icon_hover = new google.maps.MarkerImage(icon_url_hover);

    icon_normal.anchor = new google.maps.Point(8, 8);
    icon_hover.anchor = new google.maps.Point(8, 8);

    var coord = new google.maps.LatLng(point.lat(), point.lng());
    var marker = new google.maps.Marker({ map: map, position: coord,
                                          draggable: true });

    marker.setIcon(icon_normal);

    // change icon on mouseover and mouseout
    google.maps.event.addListener(marker, 'mouseover', function(evt) {
      marker.setIcon(icon_hover); });
    google.maps.event.addListener(marker, 'mouseout', function(evt) {
      marker.setIcon(icon_normal); });

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
