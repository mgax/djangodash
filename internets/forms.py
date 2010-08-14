from django import forms

from models import Lan

class LanGetForm(forms.Form):
    """ """
    bottom = forms.FloatField()
    top = forms.FloatField()
    left = forms.FloatField()
    right = forms.FloatField()

class LanForm(forms.Form):
    """ """

