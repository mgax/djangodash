from piston.handler import BaseHandler
from models import Lan, Wifi, filter_polygons
from forms import LanGetForm
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

    def create(self):
        """ """
