(function() {

internets.InternetsBrowser = function(map) {
  google.maps.event.addListener(map, 'idle', refreshInternets);
  var internets_list = $('ul#internets-list');

  return {
  }

  function refreshInternets() {
    var bounds = map.getBounds();
    var ne = bounds.getNorthEast(), sw = bounds.getSouthWest();
    var data = { top: ne.lat(), right: ne.lng(),
                 bottom: sw.lat(), left: sw.lng() };

    $.get('/api/lan', data, function(lan_list) {
      $.get('/api/wifi', data, function(wifi_list) {
        $('> li.lan', internets_list).each(function() {
          $(this).data('polygon').setMap(null);
        });
        $('> li.wifi', internets_list).each(function() {
          $(this).data('marker').setMap(null);
        });
        internets_list.empty();
        $.each(lan_list, function(i, lan_data) { createLan(lan_data); });
        $.each(wifi_list, function(i, wifi_data) { createWifi(wifi_data); });
      });
    });
  }

  function createWifi(wifi_data) {
    var icon_url = MEDIA_URL+"images/vertex-normal.png";
    var icon = new google.maps.MarkerImage(icon_url);
    icon.anchor = new google.maps.Point(8, 8);

    var coord = new google.maps.LatLng(wifi_data.geo.lat, wifi_data.geo.lon);
    var marker = new google.maps.Marker({ map: map, position: coord,
                                          icon: icon });
    var li = $('<li class="wifi">').text(wifi_data['name']);
    li.data('marker', marker);
    internets_list.append(li);
  }

  function createLan(lan_data) {
    var points = new google.maps.MVCArray();
    $.each(JSON.parse(lan_data['geo']['points_json']), function(i, p) {
      points.push(new google.maps.LatLng(p.lat, p.lon));
    });
    var polygon = new google.maps.Polygon({ map: map, paths: points });
    google.maps.event.addListener(polygon, 'click', focusOnLan);

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
      var geo = lan_data['geo'];
      var ne = new google.maps.LatLng(geo['bbox_top'], geo['bbox_right']);
      var sw = new google.maps.LatLng(geo['bbox_bottom'], geo['bbox_left']);
      map.fitBounds(new google.maps.LatLngBounds(sw, ne));
    }
  }
}

})();
