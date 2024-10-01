import sys
import os

print("WSGI module starting", file=sys.stderr)

try:
    from django.core.wsgi import get_wsgi_application
    print("Django WSGI module imported successfully", file=sys.stderr)
except ImportError as e:
    print(f"Error importing Django WSGI module: {e}", file=sys.stderr)
    raise

try:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    print(f"DJANGO_SETTINGS_MODULE set to {os.environ['DJANGO_SETTINGS_MODULE']}", file=sys.stderr)
except Exception as e:
    print(f"Error setting DJANGO_SETTINGS_MODULE: {e}", file=sys.stderr)
    raise

try:
    application = get_wsgi_application()
    print("WSGI application created successfully", file=sys.stderr)
except Exception as e:
    print(f"Error creating WSGI application: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc(file=sys.stderr)
    raise

print("WSGI module finished", file=sys.stderr)