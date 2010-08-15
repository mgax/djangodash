(function() {

internets.PolyEditor = function(map, points) {
  var vertices = new google.maps.MVCArray();
  var vertice_points = new google.maps.MVCArray();
  for(var n=0; n < points.length; n++) {
    createVertex(points[n].lat, points[n].lon);
  }

  var midpoints = new google.maps.MVCArray();
  recreateMidpoints();

  var polygon = new google.maps.Polygon({ map: map, paths: vertice_points });

  return {
    vertices: vertices,
    vertice_points: vertice_points,
    destroy: destroy,
    polygon: polygon
  }


  function createVertex(lat, lon, n) {
    if(n == null) n = vertice_points.getLength();
    var coord = new google.maps.LatLng(lat, lon);
    var marker = new google.maps.Marker({ map: map, position: coord,
                                          draggable: true });
    promoteToVertex(marker, n);
  }

  function promoteToVertex(marker, n) {
    vertices.insertAt(n, marker);
    vertice_points.insertAt(n, marker.getPosition());
    marker.setIcon(internets.icon_normal);

    // change icon on mouseover and mouseout
    google.maps.event.addListener(marker, 'mouseover', function(evt) {
      marker.setIcon(internets.icon_hover); });
    google.maps.event.addListener(marker, 'mouseout', function(evt) {
      marker.setIcon(internets.icon_normal); });

    // keep our index up-to-date when vertices are added/removed
    google.maps.event.addListener(vertice_points, 'insert_at',
                                  function(idx) { if(n >= idx) n += 1; });
    google.maps.event.addListener(vertice_points, 'remove_at',
                                  function(idx) { if(n <= idx) n -= 1; });

    // update our point in the polygon path
    google.maps.event.addListener(marker, 'drag', function(evt) {
      var new_coord = evt.latLng;
      vertice_points.setAt(n, new_coord);
      updateMidpoints();
    });
  }

  function recreateMidpoints() {
    midpoints.forEach(function(marker, i) { marker.setMap(null); });
    midpoints = new google.maps.MVCArray();
    vertice_points.forEach(function() {
      var marker = new google.maps.Marker({ map: map, icon: internets.icon_midpoint,
                                            draggable: true });
      var n = midpoints.push(marker) - 1;
      google.maps.event.addListenerOnce(marker, 'drag', function(evt) {
        midpoints.removeAt(n);
        promoteToVertex(marker, n+1);
        recreateMidpoints();
      });
    });
    updateMidpoints();
  }

  function updateMidpoints() {
    midpoints.forEach(function(marker, n1) {
      var n2 = (n1+1 < vertice_points.getLength()) ? (n1+1) : 0;
      var v1 = vertice_points.getAt(n1), v2 = vertice_points.getAt(n2);
      var lat = (v1.lat() + v2.lat()) / 2, lon = (v1.lng() + v2.lng()) / 2;
      marker.setPosition(new google.maps.LatLng(lat, lon));
    });
  }

  function destroy() {
    polygon.setMap(null);
    vertices.forEach(function(m) { m.setMap(null); });
    midpoints.forEach(function(m) { m.setMap(null); });
  }
}

})();
