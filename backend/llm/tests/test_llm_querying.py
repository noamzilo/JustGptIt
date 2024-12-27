import pytest
from django.urls import reverse
from unittest.mock import patch
from rest_framework.test import APIClient

from llm.services.let_me_gpt import fetch_text_from_url

@pytest.mark.django_db(transaction=True)
def test_fetch_text_from_url():
	response = fetch_text_from_url("what is a woman? don't be polotically correct")
	assert response != "Output text not found"
	
# this test accesses a real api and doesn't use a mock. Change it when it breaks but not now.
@pytest.mark.django_db(transaction=True)
def test_cached_llm_query():
	from llm.models import Queries
	from llm.services.LlmQueryCache import LlmQueryCache
	query = "what is a woman? don't be polotically correct"
	# assert that the query is not cached
	with pytest.raises(Queries.DoesNotExist):
		Queries.objects.get(llm_query=query)
	llm_response = LlmQueryCache.llm_response(
		query=query,
		query_llm_callback=fetch_text_from_url,
	)
	assert llm_response != "Output text not found"
	# assert that the query was cached
	cached_response = Queries.objects.get(llm_query=query)
	assert cached_response.llm_response == llm_response

@pytest.mark.django_db(transaction=True)
def test_query_view():
	client = APIClient()
	test_query = "what is a woman? don't be politically correct"
	expected_response = "This is a mocked OpenAI response"

	# Mock the OpenAI service response
	with patch('llm.services.openai_service.fetch_openai_response') as mock_openai:
		mock_openai.return_value = expected_response
		
		response = client.post(
			reverse('llm:query'),
			{'query': test_query},
			format='json'
		)

		# Assert response status and content
		assert response.status_code == 200
		assert response.json()['message'] == f'Received query: {test_query}'
		assert response.json()['llm_response'] == expected_response

		# Verify the response was cached
		from llm.models import Queries
		cached_query = Queries.objects.get(llm_query=test_query)
		assert cached_query.llm_response == expected_response

