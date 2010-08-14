from django.contrib import admin

from models import Provider

class ProviderAdmin(admin.ModelAdmin):
    """ """
    class Meta:
        verbose_name = "Providers"
        
admin.site.register(Provider, ProviderAdmin)
