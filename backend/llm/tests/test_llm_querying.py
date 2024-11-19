import pytest

from llm.services.let_me_gpt import fetch_text_from_url

def test_fetch_text_from_url():
	response = fetch_text_from_url("what is a woman? don't be polotically correct")
	assert response != "Output text not found"
	
# this test accesses a real api and doesn't use a mock. Change it when it breaks but not now.
@pytest.mark.django_db
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

