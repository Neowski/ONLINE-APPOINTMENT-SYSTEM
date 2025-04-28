from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated

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
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # List all availability for the logged-in adviser
        if request.user.user_type != 'adviser':
            return Response({"error": "Only advisers can view availability."}, status=status.HTTP_403_FORBIDDEN)
        availabilities = AdviserAvailability.objects.filter(adviser=request.user)
        serializer = AdviserAvailabilitySerializer(availabilities, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Create a new availability entry for the logged-in adviser
        if request.user.user_type != 'adviser':
            return Response({"error": "Only advisers can add availability."}, status=status.HTTP_403_FORBIDDEN)
        data = request.data.copy()
        data['adviser'] = request.user.id
        serializer = AdviserAvailabilitySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class AdviserAvailabilityDetailView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            availability = AdviserAvailability.objects.get(pk=pk, adviser=user)
            return availability
        except AdviserAvailability.DoesNotExist:
            return None

    def get(self, request, pk):
        if request.user.user_type != 'adviser':
            return Response({"error": "Only advisers can view availability."}, status=status.HTTP_403_FORBIDDEN)
        availability = self.get_object(pk, request.user)
        if availability is None:
            return Response({"error": "Availability not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = AdviserAvailabilitySerializer(availability)
        return Response(serializer.data)

    def put(self, request, pk):
        if request.user.user_type != 'adviser':
            return Response({"error": "Only advisers can update availability."}, status=status.HTTP_403_FORBIDDEN)
        availability = self.get_object(pk, request.user)
        if availability is None:
            return Response({"error": "Availability not found."}, status=status.HTTP_404_NOT_FOUND)
        data = request.data.copy()
        data['adviser'] = request.user.id
        serializer = AdviserAvailabilitySerializer(availability, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if request.user.user_type != 'adviser':
            return Response({"error": "Only advisers can delete availability."}, status=status.HTTP_403_FORBIDDEN)
        availability = self.get_object(pk, request.user)
        if availability is None:
            return Response({"error": "Availability not found."}, status=status.HTTP_404_NOT_FOUND)
        availability.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
