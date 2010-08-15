(function() {

internets.PolyEditor = function(map, point) {
  var lat = point.lat(), lon = point.lng();
  var bounds = map.getBounds();
  var width = bounds.getSouthWest().lng() - bounds.getNorthEast().lng();
  var delta = width/12;

  var icon_url_normal = MEDIA_URL+"images/vertex-normal.png";
  var icon_url_hover = MEDIA_URL+"images/vertex-hover.png";
  var icon_url_midpoint = MEDIA_URL+"images/vertex-midpoint.png";
  var icon_normal = new google.maps.MarkerImage(icon_url_normal);
  var icon_hover = new google.maps.MarkerImage(icon_url_hover);
  var icon_midpoint = new google.maps.MarkerImage(icon_url_midpoint);
  icon_normal.anchor = new google.maps.Point(8, 8);
  icon_hover.anchor = new google.maps.Point(8, 8);
  icon_midpoint.anchor = new google.maps.Point(6, 6);


  var vertices = new google.maps.MVCArray();
  var vertice_points = new google.maps.MVCArray();
  createVertex(lat-delta, lon-delta);
  createVertex(lat+delta, lon-delta);
  createVertex(lat+delta, lon+delta);
  createVertex(lat-delta, lon+delta);

  var midpoints = new google.maps.MVCArray();
  recreateMidpoints();

  var polygon = new google.maps.Polygon({ map: map, paths: vertice_points });

  return {
    vertices: vertices,
    vertice_points: vertice_points,
    destroy: destroy
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
    marker.setIcon(icon_normal);

    // change icon on mouseover and mouseout
    google.maps.event.addListener(marker, 'mouseover', function(evt) {
      marker.setIcon(icon_hover); });
    google.maps.event.addListener(marker, 'mouseout', function(evt) {
      marker.setIcon(icon_normal); });

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
      var marker = new google.maps.Marker({ map: map, icon: icon_midpoint,
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
