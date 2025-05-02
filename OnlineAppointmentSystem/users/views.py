from django.contrib.auth import authenticate, get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.decorators import login_required
import json
import logging

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import AdviserAvailability, Appointment, CustomUser
from .serializers import AdviserAvailabilitySerializer, AppointmentSerializer, CustomUserSerializer

logger = logging.getLogger(__name__)

from django.contrib.auth import login

from rest_framework.views import APIView
from rest_framework.response import Response

def csrf_init_view(request):
    return render(request, 'csrf_init.html')

class ValidatePasswordView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access this API

    def post(self, request):
        # Get the password from the request body
        password = request.data.get('password')

        if not password:
            return Response({"error": "Password is required."}, status=400)

        # Check if the logged-in user is correct
        user = request.user  # The logged-in user making the request

        if user.check_password(password):
            return Response({"success": True}, status=200)
        else:
            return Response({"error": "Incorrect password."}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class AdviserListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        advisers = CustomUser.objects.filter(user_type='adviser')
        serializer = CustomUserSerializer(advisers, many=True)
        return Response(serializer.data)
    
@ensure_csrf_cookie
@login_required
def current_user_view(request):
    user = request.user
    return JsonResponse({
        "username": user.username,
        "sr_code": getattr(user, "sr_code", ""),
        "email": user.email
    })

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

@method_decorator(csrf_exempt, name='dispatch')
class AppointmentListCreateView(APIView):
    permission_classes = [AllowAny]  # Consider using IsAuthenticated if you're using sessions/tokens

    def get(self, request):
        appointments = Appointment.objects.all()
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

        data = request.data.copy()
        # Automatically set student, SR code, and reason
        data['student'] = request.user.id
        data['sr_code'] = getattr(request.user, 'sr_code', '')  # fallback to '' if sr_code is missing
        data['reason'] = "For Evaluation of POS and Grades"

        serializer = AppointmentSerializer(data=data)
        if serializer.is_valid():
            serializer.save(student=request.user)  # ensure FK is passed as instance
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class AppointmentDetailView(APIView):
    permission_classes = [AllowAny]

    def get_object(self, pk):
        try:
            appointment = Appointment.objects.get(pk=pk)
            return appointment
        except Appointment.DoesNotExist:
            return None

    def get(self, request, pk):
        appointment = self.get_object(pk)
        if appointment is None:
            return Response({"error": "Appointment not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)

    def put(self, request, pk):
        appointment = self.get_object(pk)
        if appointment is None:
            return Response({"error": "Appointment not found."}, status=status.HTTP_404_NOT_FOUND)
        data = request.data.copy()
        serializer = AppointmentSerializer(appointment, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        appointment = self.get_object(pk)
        if appointment is None:
            return Response({"error": "Appointment not found."}, status=status.HTTP_404_NOT_FOUND)
        appointment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
