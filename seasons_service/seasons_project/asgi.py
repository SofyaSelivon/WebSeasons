import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'seasons_project.settings')

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

try:
    from seasons.routing import websocket_urlpatterns
except ImportError:
    import traceback
    print("Ошибка импорта routing.py:")
    traceback.print_exc()
    websocket_urlpatterns = []


application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(URLRouter(
        websocket_urlpatterns
        )
    ),
})