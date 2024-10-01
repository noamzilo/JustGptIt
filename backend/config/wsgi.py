"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import sys
import traceback
from django.core.wsgi import get_wsgi_application

print("WSGI module loading", file=sys.stderr)

try:
    application = get_wsgi_application()
    print("WSGI application created successfully", file=sys.stderr)
except Exception as e:
    print(f"Error creating WSGI application: {e}", file=sys.stderr)
    traceback.print_exc(file=sys.stderr)
    raise


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()

print("WSGI module loaded completely", file=sys.stderr)
