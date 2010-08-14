import json
from django.test import TestCase
from django.core.urlresolvers import reverse

from models import Lan, Wifi, save_polygon, filter_polygons

poly_data_1 = [{'lat': 10, 'lon': 10},
               {'lat': 10, 'lon': 15},
               {'lat': 15, 'lon': 12},
               {'lat': 17, 'lon': 10}]
poly_data_2 = [{'lat': 20, 'lon': 20},
               {'lat': 20, 'lon': 25},
               {'lat': 25, 'lon': 22},
               {'lat': 27, 'lon': 20}]

class PolygonTest(TestCase):
    def test_create_poly(self):
        points_json = '[{"lat": 40, "lon": 15}, {"lat": 45, "lon": 10}]'
        poly = save_polygon(points_json)
        assert poly.bbox_top == 45
        assert poly.bbox_bottom == 40
        assert poly.bbox_left == 10
        assert poly.bbox_right == 15

    def test_filter_polygons(self):

        def ids(objects):
            return set(ob.id for ob in objects)

        poly1 = save_polygon(json.dumps(poly_data_1))
        poly2 = save_polygon(json.dumps(poly_data_2))

        assert ids(filter_polygons(1, 1, 0, 0)) == ids([])
        assert ids(filter_polygons(100, 0, 100, 0)) == ids([poly1, poly2])
        assert ids(filter_polygons(15, 0, 100, 0)) == ids([poly1])
        assert ids(filter_polygons(19, 18, 100, 0)) == ids([])
        assert ids(filter_polygons(22, 15, 22, 12)) == ids([poly1, poly2])

    def test_piston_lan(self):
        """ """
        response = self.client.post(reverse('lan_piston'),
                    {'name': 'Lan1', 'info': 'info',
                     'geo': json.dumps(poly_data_1)})
        response = self.client.get(reverse('lan_piston'),
                {'top': 100, 'bottom': 0, 'right': 100, 'left': 0})
        assert response.status_code == 200
        data = json.loads(response.content)[0]
        assert len(data) is not 0
        assert data['name'] == 'Lan1'
        assert json.loads(data['geo']['points_json']) == poly_data_1
