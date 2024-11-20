from django.urls import path
from . import views

app_name = 'llm'

urlpatterns = [
    path('query', views.query, name='query'),
    path('shorten_url', views.shorten_url, name='shorten_url'),
    path('redirect/<url_hash>', views.redirect, name='redirect'),
]


"""
curl -X POST \
	localhost:8080/llm/shorten_url \
	-H "Content-Type: application/json" \
	-d '{"long_url": "https://example.com/some/very/long/url"}'

curl -X POST \
	localhost:8080/llm/query \
	-H "Content-Type: application/json" \
	-d '{"query": "abcd"}'
"""
