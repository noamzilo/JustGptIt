from models import Queries
from services.let_me_gpt import fetch_text_from_url

class LlmQueryCache:
    @staticmethod
    def get_response(query):
        try:
            cached_query = Queries.objects.get(llm_query=query)
            return cached_query.llm_response
        except Queries.DoesNotExist:
            response = fetch_text_from_url(query)
            Queries.objects.create(llm_query=query, llm_response=response)
            return response
