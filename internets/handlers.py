from piston.handler import BaseHandler
from models import Lan, Wifi

class LanHandler(BaseHandler):
    allowed_methods = ('GET', 'POST')
    model = Lan

    def read(self, pk):
        """ """

    def create(self):
        """ """
