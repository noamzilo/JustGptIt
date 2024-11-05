import json
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from .services.let_me_gpt import fetch_text_from_url

@api_view(['POST'])
def query(request):
    if request.method == 'POST':
        try:
            query = request.data.get('query')
            if not query:
                return JsonResponse({'error': 'No query provided'}, status=400)
            llm_response = fetch_text_from_url(query)
   
            response = {'message': f'Received query: {query}', "llm_response": llm_response}
            return JsonResponse(response)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)
    