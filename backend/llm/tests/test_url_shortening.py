# test_url_shortening.py

import pytest
from llm.services.UrlShortener import UrlShortener
from llm.models import ShortUrls
from django.db.utils import IntegrityError
from rest_framework.test import APIClient
from django.urls import reverse


@pytest.mark.django_db
def test_url_shortener_create_and_expand():
	long_url = 'https://www.example.com/some/very/long/url'
	
	# Test create_hash
	url_hash = UrlShortener.create_hash(long_url)
	assert len(url_hash) == 8, "URL hash should be 8 characters long"
	
	# Ensure the ShortUrls object was created
	entry = ShortUrls.objects.get(url_hash=url_hash)
	assert entry.long_url == long_url
	
	# Test expand
	retrieved_long_url = UrlShortener.expand(url_hash)
	assert retrieved_long_url == long_url

	# Test that creating the hash for the same URL returns the same hash
	url_hash_duplicate = UrlShortener.create_hash(long_url)
	assert url_hash_duplicate == url_hash
	assert ShortUrls.objects.count() == 1  # Should not create duplicate entries

@pytest.mark.django_db
def test_url_shortener_hash_collision():
	# Assuming hash_url generates same hash for these two different URLs (unlikely but for test)
	long_url1 = 'https://www.example.com/first/url'
	long_url2 = 'https://www.example.com/second/url'

	thehash = "samehash"
	# Mock hash_url to return a fixed hash to simulate collision
	original_hash_url = UrlShortener.hash_url
	UrlShortener.hash_url = lambda x: thehash

	try:
		# Create first URL hash
		url_hash1 = UrlShortener.create_hash(long_url1)
		assert url_hash1 == thehash

		# Attempt to create second URL hash. Should be the same as the first becase of the mock
		url_hash2 = UrlShortener.create_hash(long_url2)
		assert url_hash1 == url_hash2
	finally:
		# Restore the original hash_url method
		UrlShortener.hash_url = original_hash_url

@pytest.mark.django_db
def test_redirect_non_existent_short_url():
	client = APIClient()
	non_existent_hash = 'abcd1234'

	response = client.get(f'/llm/redirect/{non_existent_hash}')
	assert response.status_code == 404
	data = response.json()
	assert 'error' in data.lower()

@pytest.mark.django_db
def test_shorten_url_api_invalid_input():
	client = APIClient()

	# Test with missing long_url parameter
	response = client.post(reverse('llm:shorten_url'), {}, format='json')
	assert response.status_code == 400
	data = response.json()
	assert 'error' in data

	# Test with empty long_url
	response = client.post(reverse('llm:shorten_url'), {'long_url': ''}, format='json')
	assert response.status_code == 400
	data = response.json()
	assert 'error' in data
