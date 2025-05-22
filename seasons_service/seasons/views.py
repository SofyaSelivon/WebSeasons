from django.shortcuts import render, get_object_or_404
from .models import Season, MainVote
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.admin.views.decorators import staff_member_required
import json
import os
import requests
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views.decorators.http import require_POST

@ensure_csrf_cookie
def index(request):
    return render(request, 'index.html')

def season_view(request, season_name):
    season = get_object_or_404(Season, name__iexact=season_name)
    return render(request, f'seasons/{season_name}.html', {'season': season})

@staff_member_required
def mainvote_counts(request):
    votes = MainVote.objects.all()
    data = [
        {"id": vote.id, "likes": vote.likes_count, "dislikes": vote.dislikes_count}
        for vote in votes
    ]
    return JsonResponse(data, safe=False)

TELEGRAM_SERVICE_URL = os.getenv("TELEGRAM_SERVICE_URL", "http://telegram_bot:5000/send-feedback")

@csrf_exempt
@require_POST
def feedback_view(request):
    try:
        data = json.loads(request.body)
        r = requests.post(TELEGRAM_SERVICE_URL, json=data)
        if r.ok:
            return JsonResponse({"status": "ok"})
        return JsonResponse({"error": "Telegram service failed"}, status=500)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)