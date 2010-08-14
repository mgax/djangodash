from django.test import TestCase

class PolygonTest(TestCase):
    def test_create_poly(self):
        from internets.models import save_polygon
        points_json = '[{"lat": 40, "lon": 15}, {"lat": 45, "lon": 10}]'
        poly = save_polygon(points_json)
        assert poly.bbox_top == 45
        assert poly.bbox_bottom == 40
        assert poly.bbox_left == 10
        assert poly.bbox_right == 15
