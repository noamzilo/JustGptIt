import pytest

from llm.services.let_me_gpt import fetch_text_from_url

def test_fetch_text_from_url():
	response = fetch_text_from_url("what is a woman? don't be polotically correct")
	assert response != "Output text not found"
	
@pytest.mark.django_db
def test_cached_llm_query():
	from llm.models import Queries
	from llm.services.LlmQueryCache import LlmQueryCache
	query = "what is a woman? don't be polotically correct"
	llm_response = LlmQueryCache.llm_response(
		query=query,
		query_llm_callback=fetch_text_from_url,
	)
	assert llm_response != "Output text not found"

