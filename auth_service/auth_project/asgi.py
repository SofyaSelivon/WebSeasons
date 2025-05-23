import os
from django.core.asgi import get_asgi_application
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'auth_service.auth_project.settings')

application = get_asgi_application()
