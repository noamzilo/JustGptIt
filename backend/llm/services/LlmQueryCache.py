from models import Queries
from typing import Callable

class LlmQueryCache:
	@staticmethod
	def llm_response(
		query,
		query_llm_callback: Callable[[str], str],
	) -> str:
		try:
			cached_response = Queries.objects.get(llm_query=query)
			response = cached_response.llm_response
		except Queries.DoesNotExist:
			response = query_llm_callback(query)
			Queries.objects.create(llm_query=query, llm_response=response)
		return response
			
