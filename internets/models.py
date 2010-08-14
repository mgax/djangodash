from django.db import models

class Point(models.Model):
    """ Used to mark Wifi spots"""
    lat = models.FloatField()
    lon = models.FloatField()

class Polygon(models.Model):
    """ Used to mark LAN's """
    points_json = models.TextField() # container for JSON
    bbox_top = models.FloatField(editable=False, db_index=True)
    bbox_bottom = models.FloatField(editable=False, db_index=True)
    bbox_left = models.FloatField(editable=False, db_index=True)
    bbox_right = models.FloatField(editable=False, db_index=True)

    def __unicode__(self):
        return u"points: %r, bbox: %r" % (self.points_json, (self.bbox_bottom,
                                                            self.bbox_top,
                                                            self.bbox_right,
                                                            self.bbox_left))

class Provider(models.Model):
    """ Base class for providers """
    name = models.CharField(max_length=200,
                            help_text="Name of the LAN or SSID")
    info = models.TextField(help_text="You can use <a href='http://daringfireb"
                            "all.net/projects/markdown/syntax'>markdown</a>")
    lock = models.BooleanField(default=False, help_text="Staff can lock a loca"
                               "tion so that users cannot edit it")
    def __unicode__(self):
        return u"%s" % self.name

class Lan(Provider):
    """ This will be shown on the map as a poly """
    geo = models.ForeignKey(Polygon)

class Wifi(Provider):
    """ This will be shown on the map as a point """
    geo = models.ForeignKey(Point)

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

def filter_polygons(top, bottom, right, left):
    filters = {
        'bbox_bottom__lte': top,
        'bbox_top__gte': bottom,
        'bbox_left__lte': right,
        'bbox_right__gte': left,
    }
    return Polygon.objects.filter(**filters)
