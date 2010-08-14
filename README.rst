Django Internets
================

A geo app used to mark LAN's and wireless access points on a map.
Users can comment, comments are rated. This app allows users and administrators
of LAN's/Wifi's to show their coverage on the map for sharing their internet
connection with other people nearby.

Installation / Usage
--------------------
::
  virtualenv .
  source bin/activate
  pip install -r requirements.txt
  python manage.py syncdb
  python manage.py runserver
