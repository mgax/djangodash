(function() {

internets.InternetsBrowser = function(map) {
  google.maps.event.addListener(map, 'idle', refreshInternets);

  return {
  }

  function refreshInternets() {
    var bounds = map.getBounds();
    var ne = bounds.getNorthEast(), sw = bounds.getSouthWest();
    var data = { top: ne.lat(), right: ne.lng(),
                 bottom: sw.lat(), left: sw.lng() };

    var internets_list = $('ul#internets-list');
    $.get('/api/lan', data, function(resp) {
      $('> li', internets_list).each(function() {
        $(this).data('polygon').setMap(null);
      });
      internets_list.empty();
      $.each(resp, function(i, lan_data) { createLan(lan_data); });
    });

    function createLan(lan_data) {
      var points = new google.maps.MVCArray();
      $.each(JSON.parse(lan_data['geo']['points_json']), function(i, p) {
        points.push(new google.maps.LatLng(p.lat, p.lon));
      });
      var polygon = new google.maps.Polygon({ map: map, paths: points });

      var li = $('<li class="lan">').text(lan_data['name']);
      styleNormal();
      li.mouseover(styleHighlight);
      li.mouseout(styleNormal);
      li.click(focusOnLan);

      li.data('polygon', polygon);
      internets_list.append(li);

      function styleHighlight() {
        polygon.setOptions({fillOpacity: .6});
      }

      function styleNormal() {
        polygon.setOptions({fillOpacity: .3});
      }

      function focusOnLan() {
      }
    }
  }
}

})();
