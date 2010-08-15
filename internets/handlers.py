import json
from piston.handler import BaseHandler
from models import Lan, Wifi, Point, filter_polygons, filter_points, \
                    save_polygon
from forms import GetForm, PostForm
from piston.utils import validate

class LanHandler(BaseHandler):
    allowed_methods = ('GET', 'POST')
    model = Lan

    fields = ('name', 'info', ('geo', ('points_json', )), )

    @validate(GetForm, 'GET')
    def read(self, request):
        """ Return all polygons inside bbox coords, default limit 50 """
        polygons = filter_polygons(**request.form.cleaned_data)
        polygon_ids = [polygon.id for polygon in polygons.all()[:50]]
        return Lan.objects.filter(geo__in=polygon_ids).all()

    @validate(PostForm, 'POST')
    def create(self, request):
        """ Save a polygon then attach it to a Lan """
        request.form.cleaned_data['geo'] = save_polygon(
                                            request.form.cleaned_data['geo'])
        lan = Lan(**request.form.cleaned_data)
        lan.save()
        return True

class WifiHandler(BaseHandler):
    allowed_methods = ('GET', 'POST')
    model = Wifi

    fields = ('name', 'info', ('geo', ('lon', 'lat')), )

    @validate(GetForm, 'GET')
    def read(self, request):
        """ Return all points the inside the bbox, by default 50 """
        points = filter_points(**request.form.cleaned_data)
        point_ids = [point.id for point in points.all()[:50]]
        return Wifi.objects.filter(geo__in=point_ids).all()

    @validate(PostForm, 'POST')
    def create(self, request):
        """ """
        point = Point(**json.loads(request.form.cleaned_data['geo']))
        point.save()
        request.form.cleaned_data['geo'] = point
        wifi = Wifi(**request.form.cleaned_data)
        wifi.save()
        return True
