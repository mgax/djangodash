from django.db import models

class Provider(models.Model):
    """ Base class for providers """
    name = models.CharField(max_length=200,
                            help_text="Name of the LAN or SSID")
    info = models.TextField(help_text="You can use <a href='http://daringfireb"
                            "all.net/projects/markdown/syntax'>markdown</a>")
    lock = models.BooleanField(default=False, help_text="Staff can lock a loca"
                               "tion so that users cannot edit it")

class Lan(Provider):
    """ This will be shown on the map as a poly """

class Wifi(Provider):
    """ This will be shown on the map as a point """


class Polygon(models.Model):
    points_json = models.TextField() # container for JSON
    bbox_top = models.FloatField(editable=False, db_index=True)
    bbox_bottom = models.FloatField(editable=False, db_index=True)
    bbox_left = models.FloatField(editable=False, db_index=True)
    bbox_right = models.FloatField(editable=False, db_index=True)

def save_polygon(points_json):
    import json
    points = json.loads(points_json)
    # TODO: validate JSON structure
    polygon = Polygon(points_json=points_json,
                      bbox_top=max(p['lat'] for p in points),
                      bbox_bottom=min(p['lat'] for p in points),
                      bbox_right=max(p['lon'] for p in points),
                      bbox_left=min(p['lon'] for p in points))
    polygon.save()
    return polygon

def filter_polygons(bbox_top, bbox_bottom, bbox_right, bbox_left):
    filters = {
        'bbox_top__gte': bbox_bottom,
        'bbox_bottom__lte': bbox_top,
        'bbox_right__gte': bbox_left,
        'bbox_left__lte': bbox_right,
    }
    return Polygon.objects.filter(**filters)
