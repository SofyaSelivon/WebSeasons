from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('healthz/', health_check),
    path('', health_check),  # Добавлено для обработки корневого пути
    path('', include('users.urls')),
]
