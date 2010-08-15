import json
from django import forms
from django.test import TestCase
from django.core.urlresolvers import reverse

from models import Lan, Wifi, Point, save_polygon, filter_polygons, \
                    filter_points

poly_data_1 = [{'lat': 10, 'lon': 10},
               {'lat': 10, 'lon': 15},
               {'lat': 15, 'lon': 12},
               {'lat': 17, 'lon': 10}]
poly_data_2 = [{'lat': 20, 'lon': 20},
               {'lat': 20, 'lon': 25},
               {'lat': 25, 'lon': 22},
               {'lat': 27, 'lon': 20}]

point_data_1 = {'lat': 2.331, 'lon': 1.1}
point_data_2 = {'lat': -14.331, 'lon': 45}
point_data_3 = {'lat': -92, 'lon': 20}

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

    def test_create_points(self):
        point1 = Point(**point_data_1)
        point1.clean()
        point2 = Point(**point_data_2)
        point1.clean()
        point3 = Point(**point_data_3)
        self.assertRaises(forms.ValidationError, point3.clean)

    def test_filter_points(self):
        point1 = Point(**point_data_1)
        point1.save()
        point2 = Point(**point_data_2)
        point2.save()
        assert [x for x in filter_points(100, 0, 100, 0)] == [point1]
        assert [x for x in filter_points(0, -20, 50, 0)] == [point2]

    def test_piston_wifi(self):
        """ """
        response = self.client.post(reverse('wifi_piston'),
                    {'name': 'Wifi1', 'info': 'info',
                     'geo': json.dumps(point_data_1)})
        assert response.status_code == 200
        assert json.loads(response.content) == True
        response = self.client.get(reverse('wifi_piston'),
                {'top': 100, 'bottom': 0, 'right': 100, 'left': 0})
        assert response.status_code == 200
        data = json.loads(response.content)[0]
        assert len(data) is not 0
        assert data['name'] == 'Wifi1'
        assert data['geo'] == point_data_1
