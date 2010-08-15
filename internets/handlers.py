import json
from piston.handler import BaseHandler
from models import Lan, Wifi, Point, Polygon, filter_polygons, filter_points, \
                    save_polygon
from forms import GetForm, PostForm
from piston.utils import rc, validate

class LanHandler(BaseHandler):
    allowed_methods = ('GET', 'POST', 'PUT')
    model = Lan

    fields = ('name', 'info', ('geo', ('points_json', 'bbox_top',
                'bbox_bottom', 'bbox_left', 'bbox_right')), )

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
        return rc.CREATED

    @validate(PostForm, 'PUT')
    def update(self, request, pk):
        """ Check if object exists then check if user has permission to edit it

        """
        try:
            lan = Lan.objects.get(pk=pk)
        except Lan.DoesNotExist:
            return rc.NOT_HERE
        if lan.lock == True and not request.user.is_staff():
            return rc.FORBIDDEN
        lan.name = request.form.cleaned_data['name']
        lan.info = request.form.cleaned_data['info']
        if request.form.cleaned_data['geo'] != lan.geo.points_json:
            lan.geo = save_polygon(request.form.cleaned_data['geo'])
        lan.save()

class WifiHandler(BaseHandler):
    allowed_methods = ('GET', 'POST', 'PUT')
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
        return rc.CREATED

    @validate(PostForm, 'PUT')
    def update(self, request, pk):
        """ Check if object exists then check if user has permission to edit it

        """
        try:
            wifi = Wifi.objects.get(pk=pk)
        except Wifi.DoesNotExist:
            return rc.NOT_HERE
        if wifi.lock == True and not request.user.is_staff():
            return rc.FORBIDDEN
        wifi.name = request.form.cleaned_data['name']
        wifi.info = request.form.cleaned_data['info']
        geo = json.loads(request.form.cleaned_data['geo'])
        if not (wifi.geo.lat == geo['lat'] and wifi.geo.lon == geo['lon']):
            wifi.geo = Point(**geo)
        wifi.save()
