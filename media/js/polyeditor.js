function createPolyEditor(map, lat, lon) {
  var bounds = map.getBounds();
  var width = bounds.getSouthWest().lng() - bounds.getNorthEast().lng();
  var delta = width/8;

  var vertices = new google.maps.MVCArray();

  createVertex(lat+delta, lon+delta);
  createVertex(lat+delta, lon-delta);
  createVertex(lat-delta, lon-delta);
  createVertex(lat-delta, lon+delta);

  var poly = new google.maps.Polygon({ map: map, paths: vertices });

  function createVertex(lat, lon, n) {
    if(n == null) n = vertices.getLength();
    var coord = new google.maps.LatLng(lat, lon);
    vertices.insertAt(n, coord);
    var marker = new google.maps.Marker({ map: map, position: coord,
                                          draggable: true });

    // keep our index up-to-date when vertices are added/removed
    google.maps.event.addListener(vertices, 'insert_at',
                                  function(idx) { if(n >= idx) n += 1; });
    google.maps.event.addListener(vertices, 'remove_at',
                                  function(idx) { if(n <= idx) n -= 1; });

    // update our point in the polygon path
    google.maps.event.addListener(marker, 'drag', function(evt) {
        var new_coord = evt.latLng;
        vertices.setAt(n, new_coord);
    });
  }
}
