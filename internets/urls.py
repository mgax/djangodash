from django.conf.urls.defaults import *

from piston.resource import Resource

from handlers import LanHandler, WifiHandler

urlpatterns = patterns('',
    url(r'^lan$', Resource(LanHandler), {'emitter_format': 'json'},
                                        name="lan_piston"),
    url(r'^wifi$', Resource(WifiHandler), {'emitter_format': 'json'},
                                        name="wifi_piston"),
)
