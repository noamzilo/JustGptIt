import pytest
from unittest.mock import patch, MagicMock
from llm.services.openai_service import fetch_openai_response

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

        # Test the function
        response = fetch_openai_response("Test query")
        
        # Assertions
        assert response == "This is a mock response from OpenAI"
        mock_client.chat.completions.create.assert_called_once_with(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Test query"}]
        )

def test_fetch_openai_response_error():
    with patch('openai.OpenAI') as mock_openai:
        # Configure the mock to raise an exception
        mock_client = MagicMock()
        mock_client.chat.completions.create.side_effect = Exception("API Error")
        mock_openai.return_value = mock_client

        # Test the function
        response = fetch_openai_response("Test query")
        
        # Assertions
        assert response.startswith("Error: ")
        assert "API Error" in response

@pytest.mark.django_db
def test_cached_openai_query(mock_openai_response):
    from llm.models import Queries
    from llm.services.LlmQueryCache import LlmQueryCache
    
    with patch('openai.OpenAI') as mock_openai:
        # Configure the mock
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = mock_openai_response
        mock_openai.return_value = mock_client

        query = "What is artificial intelligence?"
        
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
