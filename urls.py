from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',

    url(r'^$', 'django.views.generic.simple.direct_to_template',
        {'template': 'index.html'}, name="index"),
    url(r'^admin/', include(admin.site.urls)),
)
