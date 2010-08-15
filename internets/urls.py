from django.conf.urls.defaults import *

from piston.resource import Resource

from handlers import LanHandler, WifiHandler

urlpatterns = patterns('',
    url(r'^lan$', Resource(LanHandler),
        {'emitter_format': 'json'}, name="lan_piston"),
    url(r'^lan/(?P<pk>\d+)/$', Resource(WifiHandler),
        {'emitter_format': 'json'}, name="lan_piston_update"),

    url(r'^wifi$', Resource(WifiHandler),
        {'emitter_format': 'json'}, name="wifi_piston"),
    url(r'^wifi/(?P<pk>\d+)/$', Resource(WifiHandler),
        {'emitter_format': 'json'}, name="wifi_piston_update"),
)
