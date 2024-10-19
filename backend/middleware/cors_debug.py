import logging

logger = logging.getLogger(__name__)

class CORSDebugMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        logger.debug(f"Request origin: {request.META.get('HTTP_ORIGIN')}")
        logger.debug(f"CORS headers in response: {[header for header in response if header.startswith('Access-Control-')]}")
        
        return response