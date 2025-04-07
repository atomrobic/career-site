import os
from django.core.wsgi import get_wsgi_application

# Change the settings module path to match your project structure
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')

application = get_wsgi_application()
