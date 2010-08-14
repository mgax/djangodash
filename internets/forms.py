from django import forms

class GetForm(forms.Form):
    bottom = forms.FloatField()
    top = forms.FloatField()
    left = forms.FloatField()
    right = forms.FloatField()

class PostForm(forms.Form):
    name = forms.CharField()
    info = forms.CharField()
    geo = forms.CharField()
