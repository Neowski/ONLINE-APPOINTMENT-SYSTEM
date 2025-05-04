from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")
            if email is None or password is None:
                logger.debug("Email or password not provided")
                return JsonResponse({"error": "Email and password are required."}, status=400)

            user = authenticate(request, username=email, password=password)
            if user is not None:
                if not user.is_active:
                    logger.debug(f"User {email} is inactive")
                    return JsonResponse({"error": "User account is inactive."}, status=403)
                logger.debug(f"User {email} authenticated successfully")
                return JsonResponse({
                    "message": "Login successful",
                    "user_id": user.id,
                    "email": user.email,
                    "user_type": user.user_type
                })
            else:
                logger.debug(f"Authentication failed for user {email}")
                return JsonResponse({"error": "Invalid email or password."}, status=401)
        except json.JSONDecodeError:
            logger.debug("Invalid JSON in request body")
            return JsonResponse({"error": "Invalid JSON."}, status=400)
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=405)
