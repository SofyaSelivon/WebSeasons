from django.urls import re_path
from .consumers import LikeConsumer

websocket_urlpatterns = [
    re_path(r'ws/likes/index/$', LikeConsumer.as_asgi()),
]
