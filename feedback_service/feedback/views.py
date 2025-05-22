import json
import os
import logging
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "8181012222:AAEbvmvDuNhgRV4Fl9-msjcu3uWG4AP5FCg")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "1000604653")


logger = logging.getLogger(__name__)

@csrf_exempt
@require_POST
def feedback_view(request):
    try:
        data = json.loads(request.body)
        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        message = data.get("message", "").strip()

        if not (name and email and message):
            return JsonResponse({"error": "Заполните все поля"}, status=400)

        text = f"Новое сообщение от {name} ({email}): {message}"

        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": text,
        }

        r = requests.post(url, json=payload)
        try:
            r_data = r.json()
        except Exception:
            r_data = r.text

        logger.error(f"Telegram API response status: {r.status_code}, data: {r_data}")

        if r.ok and isinstance(r_data, dict) and r_data.get("ok"):
            return JsonResponse({"status": "ok"})
        else:
            return JsonResponse({"error": "Ошибка при отправке сообщения в Telegram"}, status=500)
    except Exception as e:
        logger.error(f"Exception in feedback_view: {e}", exc_info=True)
        return JsonResponse({"error": str(e)}, status=500)
