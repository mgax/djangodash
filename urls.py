from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template
from django.contrib import admin
from internets import urls as internets_urls
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'django.views.generic.simple.direct_to_template',
        {'template': 'index.html'}, name="index"),
    url(r'^api/', include(internets_urls)),
    url(r'^admin/', include(admin.site.urls)),
)
