from django.urls import path
from . import views

app_name = 'llm'

urlpatterns = [
    path('query', views.query, name='query'),
    path('shorten_url', views.shorten_url, name='shorten_url'),
    path('redirect/<short_url>', views.redirect, name='redirect'),
]
