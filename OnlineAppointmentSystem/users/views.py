from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from .models import AdviserAvailability
from .serializers import AdviserAvailabilitySerializer

logger = logging.getLogger(__name__)

from django.contrib.auth import login

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
                login(request, user)  # Log the user in to create session
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

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class AdviserAvailabilityListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        availabilities = AdviserAvailability.objects.all()
        serializer = AdviserAvailabilitySerializer(availabilities, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        serializer = AdviserAvailabilitySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class AdviserAvailabilityDetailView(APIView):
    permission_classes = [AllowAny]

    def get_object(self, pk):
        try:
            availability = AdviserAvailability.objects.get(pk=pk)
            return availability
        except AdviserAvailability.DoesNotExist:
            return None

    def get(self, request, pk):
        availability = self.get_object(pk)
        if availability is None:
            return Response({"error": "Availability not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = AdviserAvailabilitySerializer(availability)
        return Response(serializer.data)

    def put(self, request, pk):
        availability = self.get_object(pk)
        if availability is None:
            return Response({"error": "Availability not found."}, status=status.HTTP_404_NOT_FOUND)
        data = request.data.copy()
        serializer = AdviserAvailabilitySerializer(availability, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        availability = self.get_object(pk)
        if availability is None:
            return Response({"error": "Availability not found."}, status=status.HTTP_404_NOT_FOUND)
        availability.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
