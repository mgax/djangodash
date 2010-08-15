(function() {

  (function() {
    var icon_url_normal = MEDIA_URL+"images/vertex-normal.png";
    var icon_url_hover = MEDIA_URL+"images/vertex-hover.png";
    var icon_url_midpoint = MEDIA_URL+"images/vertex-midpoint.png";

    var icon_normal = new google.maps.MarkerImage(icon_url_normal);
    var icon_hover = new google.maps.MarkerImage(icon_url_hover);
    var icon_midpoint = new google.maps.MarkerImage(icon_url_midpoint);

    icon_normal.anchor = new google.maps.Point(8, 8);
    icon_hover.anchor = new google.maps.Point(8, 8);
    icon_midpoint.anchor = new google.maps.Point(6, 6);

    window.internets = {
      icon_normal: icon_normal,
      icon_hover: icon_hover,
      icon_midpoint: icon_midpoint
    };
  })();

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

    var form = $('<form>').submit(function(evt) {
      evt.preventDefault();
      var points = [];
      poly_editor.vertice_points.forEach(function(p) {
        points.push({lat: p.lat(), lon: p.lng()});
      });
      var form_data = form.serialize() + '&geo=' +
                      encodeURIComponent(JSON.stringify(points));

      $.ajax({url: "/api/lan", type: 'POST', data: form_data,
          beforeSend: function() {
            form.find(":input").attr('disabled', 'disabled');
            form.addClass('saving');
          },

          success: function() {
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
    });

    form.bind('reset', function() {
      cleanup();
      return false;
    });

    form.append('<input type="text" name="name" placeholder="Lan Name">',
                '<textarea name="info" placeholder="Lan Information"></textarea>',
                '<input type="submit" name="do" value="save">',
                '<input type="reset" name="do" value="cancel">');

    function cleanup() {
      form.remove();
      poly_editor.destroy();
    }
    form.appendTo($('div#new-forms'));
  }

  internets.newWifi = function(map, point) {
    var marker = internets.PointEditor(map, point);
    var form = $('<form>').submit(function() {
      var form_data = form.serialize() + '&geo=' + encodeURIComponent(JSON.stringify(marker.position()));
      $.ajax({url: "/api/wifi", type: 'POST', data: form_data,

          beforeSend: function() {
            form.find(":input").attr('disabled', 'disabled');
            form.addClass('saving');
          },

          success: function() {
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

    form.bind('reset', function() { form.remove(); marker.destroy(); });

    form.append('<input type="text" name="name" placeholder="Wireless Network Name">',
                '<textarea name="info" placeholder="Wireless Network Information"></textarea>',
                '<input type="submit" name="do" value="save">',
                '<input type="reset" name="do" value="cancel">');
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
