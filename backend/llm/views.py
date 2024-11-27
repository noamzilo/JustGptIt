from django.http import JsonResponse, HttpResponseRedirect
from rest_framework.decorators import api_view
from llm.services.let_me_gpt import fetch_text_from_url
from llm.services.LlmQueryCache import LlmQueryCache
from llm.services.UrlShortener import UrlShortener

@api_view(['POST'])
def query(request):
	query = request.data.get('query')
	if not query:
		return JsonResponse({'error': 'No query provided'}, status=400)

	llm_response = LlmQueryCache.llm_response(
		query=query,
		query_llm_callback=fetch_text_from_url,
	)
	response = {'message': f'Received query: {query}', 'llm_response': llm_response}
	return JsonResponse(response)

# Return the short URL as data. For actually using the short URL, there is a different view.
@api_view(['POST'])
def shorten_url(request):
	long_url = request.data.get('long_url')
	client_host_name = request.data.get('client_host_name')
	if not long_url:
		return JsonResponse({'error': 'No long_url provided'}, status=400)
	url_hash = UrlShortener.create_hash(long_url)
	# full_short_url = request.build_absolute_uri(f'/llm/redirect/{url_hash}')
	scheme = request.scheme
	host = client_host_name
	base_url = f'{scheme}://{host}/r/'
	full_short_url = f'{base_url}{url_hash}'
	response = {
		'long_url': long_url,
		'short_url': full_short_url,
		'hash': url_hash
	}
	return JsonResponse(response)

# View to handle redirection when the short URL is accessed.
# def redirect(request, url_hash):
#     try:
#         long_url = UrlShortener.expand(url_hash)
#         return HttpResponseRedirect(long_url)
#     except ValueError as e:
#         return JsonResponse({'error': str(e)}, status=404)


def expand_hash(request, url_hash):
	try:
		long_url = UrlShortener.expand(url_hash)
		return JsonResponse({"long_url": long_url})
	except ValueError as e:
		return JsonResponse({'error': str(e)}, status=404)


