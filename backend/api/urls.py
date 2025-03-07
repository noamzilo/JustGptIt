from django.urls import path
from . import views
from django.views.generic import TemplateView
import sys

app_name = 'api'

print("URLs module loaded", file=sys.stderr)

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),
    path('version', views.version, name='version'),
    path('health', views.health_check, name='health_check'),
    path('test', views.test_view, name='test_view'),
	path('send-email', views.send_email, name='send_email'),
]
