from django.urls import path
from . import views

app_name = 'llm'

urlpatterns = [
    path('query', views.query, name='query'),
    path('shorten_url', views.shorten_url, name='shorten_url'),
    # path('redirect/<url_hash>', views.redirect, name='redirect'),
    path('expand_hash/<url_hash>', views.expand_hash, name='expand_hash'),
]


"""
 curl -X POST      \
 	localhost:8080/llm/shorten_url \
	-H "Content-Type: application/json"\
    -d '{"long_url": "https://example.com/some/very/long/url",	 "client_host_name": "localhost:3111"}'


curl -X POST \
	https://personal-website-backend-839353010571.us-central1.run.app/llm/shorten_url \
	-H "Content-Type: application/json" \
	-d '{"long_url": "https://example.com/some/very/long/url"}'

http://localhost:8080/llm/redirect/O95EWPK8

curl -X POST \
	localhost:8080/llm/query \
	-H "Content-Type: application/json" \
	-d '{"query": "abcd"}'


	curl -X POST \
	https://personal-website-backend-839353010571.us-central1.run.app/llm/query \
	-H "Content-Type: application/json" \
	-d '{"query": "abcd"}'

	curl https://personal-website-backend-839353010571.us-central1.run.app/llm/expand_hash/PYodeOdC
"""
