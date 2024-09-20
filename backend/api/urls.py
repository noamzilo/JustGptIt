from django.urls import path
from . import views
from django.views.generic import TemplateView

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),
    path('hello/', views.hello_world, name='hello_world'),
    path('projects/', views.ProjectList.as_view(), name='project-list'),
]