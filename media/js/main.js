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

    gmap = initializeMap();
    navigator.geolocation.getCurrentPosition(function(pos) {
      var current_location = new google.maps.LatLng(pos.coords.latitude,
                                                    pos.coords.longitude);
      gmap.setCenter(current_location);
    });

    return {
      gmap: gmap,
    }

  }

  internets.newNetwork = function(map, point) {
    var poly_editor = new internets.PolyEditor(map, point);

    var frm = $('<form>').submit(function(evt) {
      evt.preventDefault();
      var points = [];
      poly_editor.vertice_points.forEach(function(p) {
        points.push({lat: p.lat(), lon: p.lng()});
      });
      var form_data = frm.serialize() + '&geo=' +
                      encodeURIComponent(JSON.stringify(points));
      $(':input', frm).attr('disabled', 'disabled');
      frm.append('saving... ');
      $.ajax({url: "/api/lan", type: 'POST', data: form_data,
              success: cleanup, error: function() {
                frm.append('ERROR');
                $(':input', frm).attr('disabled', null);
              } });
    });
    frm.append('<input name="name">',
               '<textarea name="info"></textarea>',
               '<input type="submit" name="do" value="save">');
    $('<input type="submit" name="do" value="cancel">').click(function(evt) {
      evt.preventDefault(); cleanup(); }).appendTo(frm);

    function cleanup() {
      frm.remove();
      poly_editor.destroy();
    }
    frm.appendTo($('div#new-forms'));
  }

  internets.newWifi = function(map, point) {
    var marker = internets.WifiPoint(map, point);
    var form = $('<form>').submit(function() {
      var form_data = form.serialize() + '&geo=' + encodeURIComponent(JSON.stringify(marker.position()));
      $.ajax({url: "/api/wifi", type: 'POST', data: form_data,

          beforeSend: function() {
            form.find(":input").attr('disabled', 'disabled');
            form.addClass('saving');
          },

          success: function() {
            console.log('success');
            form.remove();
            marker.destroy();
          },

          error: function() {
            form.addClass('error');
          },

          complete: function() {
            form.removeClass('loading');
            $(':input', form).attr('disabled', null);
          }
        });
      return false;
    });

    form.append('<input name="name">',
                '<textarea name="info"></textarea>',
                '<input type="submit" name="do" value="save">');
    form.appendTo($('div#new-forms'));
  }
})();

$(function() {
  var map_element = document.getElementById('map');
  if ( map_element ) {
    var map = new internets.Map(map_element);

    $('button#new-lan').click(function(evt) {
      var button = $(this);
      var orig_text = button.text();
      button.attr('disabled', 'disabled').text("Click on map");
      google.maps.event.addListenerOnce(map.gmap, 'click', function(evt) {
        button.text(orig_text).attr('disabled', null);
        internets.newNetwork(map.gmap, evt.latLng);
      });
    });

    new internets.InternetsBrowser(map.gmap);
    $('button#new-wifi').click(function() {
      var button = $(this);
      var orig_text = button.text();
      button.attr('disabled', 'disabled').text("Click on map");
      google.maps.event.addListenerOnce(map.gmap, 'click', function(evt) {
        button.text(orig_text).attr('disabled', null);
        internets.newWifi(map.gmap, evt.latLng);
      });
    });
  }
});
