import json
from django.http import JsonResponse
from rest_framework.decorators import api_view
from llm.services.let_me_gpt import fetch_text_from_url
from llm.services.LlmQueryCache import LlmQueryCache

@api_view(['POST'])
def query(request):
    if request.method == 'POST':
        try:
            query = request.data.get('query')
            if not query:
                return JsonResponse({'error': 'No query provided'}, status=400)
            llm_response = LlmQueryCache.llm_response(
                query=query,
                query_llm_callback=fetch_text_from_url,
			)
   
            response = {'message': f'Received query: {query}', "llm_response": llm_response}
            return JsonResponse(response)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)
    