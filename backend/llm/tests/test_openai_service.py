import pytest
from unittest.mock import patch, MagicMock
import openai
from llm.services.openai_service import fetch_openai_response
import os

@pytest.fixture
def mock_openai_response():
	mock_response = MagicMock()
	mock_response.choices = [
		MagicMock(
			message=MagicMock(
				content="This is a mock response from OpenAI"
			)
		)
	]
	return mock_response

def test_fetch_openai_response_success(mock_openai_response):
	with patch('openai.OpenAI') as mock_openai:
		# Configure the mock
		mock_client = MagicMock()
		mock_client.chat.completions.create.return_value = mock_openai_response
		mock_openai.return_value = mock_client

		# Test the function with a dummy API key
		response = fetch_openai_response("Test query", api_key="test-key")
		
		# Assertions
		assert response == "This is a mock response from OpenAI"
		mock_client.chat.completions.create.assert_called_once_with(
			model="gpt-3.5-turbo",
			messages=[{"role": "user", "content": "Test query"}]
		)

def test_fetch_openai_response_error():
	with patch('openai.ChatCompletion.create') as mock_create:
		# Configure the mock to raise an exception
		mock_create.side_effect = Exception("API Error")

		# Test the function
		response = fetch_openai_response("Test query")
		
		# Assertions
		assert response.startswith("Error: "), f"Unexpected response: {response}"


@pytest.mark.django_db
def test_cached_openai_query(mock_openai_response):
	from llm.models import Queries
	from llm.services.LlmQueryCache import LlmQueryCache
	
	with patch('openai.OpenAI') as mock_openai:
		# Configure the mock
		mock_client = MagicMock()
		mock_client.chat.completions.create.return_value = mock_openai_response
		mock_openai.return_value = mock_client

		query = "What is artificial intelligence? __not__cached__158"
		
		# Assert that the query is not cached
		with pytest.raises(Queries.DoesNotExist):
			Queries.objects.get(llm_query=query)
		
		# Get response through cache
		llm_response = LlmQueryCache.llm_response(
			query=query,
			query_llm_callback=fetch_openai_response,
		)
		
		# Verify response
		assert llm_response == "This is a mock response from OpenAI"
		
		# Assert that the query was cached
		cached_response = Queries.objects.get(llm_query=query)
		assert cached_response.llm_response == llm_response
		
		# Verify OpenAI was called only once
		mock_client.chat.completions.create.assert_called_once()

@pytest.mark.integration
@pytest.mark.skipif(not os.getenv('RUN_INTEGRATION_TESTS'), reason="Integration tests are not enabled")
def test_fetch_openai_response_integration():
	"""
	Integration test that actually calls OpenAI API.
	To run this test, set RUN_INTEGRATION_TESTS=1 in your environment.
	"""
	# Simple query that should always work
	query = "say only hi"
	
	response = fetch_openai_response(query)
	
	# Check that we got a response and not an error
	assert not response.startswith("Error: "), f"Got error response: {response}"
	
	# Check that we got some actual content
	assert len(response) > 0, "Response was empty"
	
	# Basic validation that response looks reasonable
	assert isinstance(response, str), f"Response should be string, got {type(response)}"
	assert len(response) < 1000, f"Response suspiciously long: {len(response)} chars"

def test_fetch_openai_response_invalid_key():
	"""Test behavior with invalid API key"""
	response = fetch_openai_response("test query", api_key="invalid_key_123")
	assert response.startswith("Error: "), "Should have received an error with invalid key"
	assert "api key" in response.lower(), f"Unexpected error message: {response}"
