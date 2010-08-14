from django.conf.urls.defaults import *

from piston.resource import Resource

from handlers import LanHandler

urlpatterns = patterns('',
    url(r'^lan$', Resource(LanHandler), {'emitter_format': 'json'},
                                        name="lan_piston"),
)
