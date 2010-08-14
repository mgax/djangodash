from django import forms

from models import Lan

class LanGetForm(forms.Form):
    bottom = forms.FloatField()
    top = forms.FloatField()
    left = forms.FloatField()
    right = forms.FloatField()

class LanPostForm(forms.Form):
    name = forms.CharField()
    info = forms.CharField()
    geo = forms.CharField()

