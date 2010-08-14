from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template
from django.contrib import admin
from django.conf import settings
admin.autodiscover()

urlpatterns = patterns('',

    url(r'^$', 'django.views.generic.simple.direct_to_template',
        {'template': 'index.html'}, name="index"),
    url(r'^admin/', include(admin.site.urls)),
)

if settings.DEBUG:
    urlpatterns += patterns('',
    (r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
)

