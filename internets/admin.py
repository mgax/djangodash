from django.contrib import admin

from models import Lan, Wifi

class LanAdmin(admin.ModelAdmin):
    """ """
    class Meta:
        verbose_name = "Local Area Networks"

class WifiAdmin(admin.ModelAdmin):
    """ """
    class Meta:
        verbose_name = "WIFI hotspots"

admin.site.register(Lan, LanAdmin)
admin.site.register(Wifi, WifiAdmin)
