from django.db import models

class Provider(models.Model):
    """ """
    name = models.CharField(max_length=200)
    email = models.EmailField()
    url = models.URLField()
    phone = models.CharField(max_length=50)
    lock = models.BooleanField(default=False)
