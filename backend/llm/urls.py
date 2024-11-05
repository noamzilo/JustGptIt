from django.urls import path
from . import views

app_name = 'llm'

urlpatterns = [
    path('query', views.query, name='query'),
]