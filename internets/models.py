from django.db import models

class Provider(models.Model):
    """ Base class for providers """
    name = models.CharField(max_length=200,
                            help_text="Name of the LAN or SSID")
    contact = models.TextField(help_text="Contact information")
    info = models.TextField(help_text="Use markdown")
    lock = models.BooleanField(default=False)

class Lan(Provider):
    """ This will be shown on the map as a poly """

class Wifi(Provider):
    """ This will be shown on the map as a point """
    password = models.CharField(max_length=200)
