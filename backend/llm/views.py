import json
from django.http import JsonResponse, HttpResponseRedirect
from rest_framework.decorators import api_view
from llm.services.let_me_gpt import fetch_text_from_url
from llm.services.LlmQueryCache import LlmQueryCache
from llm.services.UrlShortener import UrlShortener
from django.shortcuts import get_object_or_404

@api_view(['POST'])
def query(request):
	if request.method != 'POST':
		return JsonResponse({'error': 'Invalid HTTP method'}, status=405)
	try:
		query = request.data.get('query')
	except json.JSONDecodeError:
		return JsonResponse({'error': 'Invalid JSON'}, status=400)
	if not query:
		return JsonResponse({'error': 'No query provided'}, status=400)
	
	llm_response = LlmQueryCache.llm_response(
		query=query,
		query_llm_callback=fetch_text_from_url,
	)
	response = {'message': f'Received query: {query}', "llm_response": llm_response}
	return JsonResponse(response)


# Return the short URL as data. For actually using the short URL, there is a different view.
@api_view(['POST'])
def shorten_url(request):
	if request.method != 'POST':
		return JsonResponse({'error': 'Invalid HTTP method'}, status=405)
	try:
		long_url = request.data.get('long_url')
	except json.JSONDecodeError:
		return JsonResponse({'error': 'Invalid JSON'}, status=400)
	if not long_url:
		return JsonResponse({'error': 'No long_url provided'}, status=400)
	short_url = UrlShortener.hash(long_url)
	full_short_url = request.build_absolute_uri(f'/redirect/{short_url}')
	response = {
		'long_url': long_url,
		"short_url": full_short_url
	}
	return JsonResponse(response)

# View to handle redirection when the short URL is accessed.
def redirect(request, short_url):
	try:
		long_url = UrlShortener.expand(short_url)
		return HttpResponseRedirect(long_url)
	except ValueError as e:
		return JsonResponse({'error': str(e)}, status=404)
