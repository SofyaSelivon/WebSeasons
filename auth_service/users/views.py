from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
import json
import logging

logger = logging.getLogger(__name__)

@csrf_protect
def register_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user = User.objects.create_user(
                username=data['email'],
                email=data['email'],
                password=data['password'],
                first_name=data.get('first-name', ''),
                last_name=data.get('last-name', '')
            )
            return JsonResponse({"status": "success", "user": {
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
            }})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

@csrf_protect
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user = authenticate(username=data['email'], password=data['password'])
            if user:
                login(request, user)
                return JsonResponse({"status": "success", "user": {
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name
                }})
            return JsonResponse({"error": "Неверный логин или пароль"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

def logout_user(request):
    logout(request)
    return JsonResponse({"message": "Вы вышли"})

def check_auth(request):
    if request.user.is_authenticated:
        return JsonResponse({"authenticated": True, "user": {
            "email": request.user.email,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name
        }})
    return JsonResponse({"authenticated": False})
