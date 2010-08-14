from piston.handler import BaseHandler
from models import Lan, Wifi, filter_polygons, save_polygon
from forms import LanGetForm, LanPostForm
from piston.utils import validate

class LanHandler(BaseHandler):
    allowed_methods = ('GET', 'POST')
    model = Lan

    fields = ('name', 'info', ('geo', ('points_json', )), )

    @validate(LanGetForm, 'GET')
    def read(self, request):
        """ Return all polygons using the inside the bbox, by default 50 """
        polygons = filter_polygons(**dict(request.form.cleaned_data))
        polygon_ids = [polygon.id for polygon in polygons.all()[:50]]
        return Lan.objects.filter(geo__in=polygon_ids).all()

    @validate(LanPostForm, 'POST')
    def create(self, request):
        """ """
        request.form.cleaned_data['geo'] = save_polygon(
                                            request.form.cleaned_data['geo'])
        lan = Lan(**request.form.cleaned_data)
        lan.save()
        return True

