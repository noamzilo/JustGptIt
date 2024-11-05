from django.urls import path
from . import views
from django.views.generic import TemplateView
import sys

print("URLs module loaded", file=sys.stderr)

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),
    path('version', views.version, name='version'),
    path('projects/', views.ProjectList.as_view(), name='project-list'),
    path('health', views.health_check, name='health_check'),
    path('llm', views.llm, name='llm'),
    path('test', views.test_view, name='test_view'),
]
