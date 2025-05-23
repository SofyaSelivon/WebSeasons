from django.http import JsonResponse
from django.urls import path
from . import views
def health_check(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path("healthz/", health_check),
    path('register/', views.register_user),
    path('login/', views.login_user),
    path('logout/', views.logout_user),
    path('check_auth/', views.check_auth),
]
