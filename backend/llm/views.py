import json
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view


@api_view(['POST'])
def query(request):
    if request.method == 'POST':
        try:
            query = request.data.get('query')
            if not query:
                return JsonResponse({'error': 'No query provided'}, status=400)
   
            response = {'message': f'Received query: {query}'}
            return JsonResponse(response)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)
    