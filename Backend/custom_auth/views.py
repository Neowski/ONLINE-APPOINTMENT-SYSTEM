from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from .models import User
from .serializers import UserSerializer

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Handle user registration
        Expected POST data:
        {
            "username": "username",
            "email": "email@example.com",
            "password": "password",
            "user_type": "student|adviser|admin"
        }
        """
        data = request.data
        data['password'] = make_password(data['password'])
        
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': 'User created successfully'
            }, status=status.HTTP_201_CREATED)
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class UserDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def delete(self, request, username):
        try:
            user = User.objects.get(username=username)
            user.delete()
            return Response({
                'status': 'success',
                'message': f'User {username} deleted successfully'
            }, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)

class LoginView(APIView):
    """
    Handle user login requests
    Expected POST data:
    {
        "username": "username",
        "password": "password"
    }
    Returns:
    - Success: {"status": "success", "user_type": user_type}
    - Error: {"status": "error", "message": "Invalid credentials"}
    """
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user:
            return Response({
                'status': 'success',
                'user_type': user.user_type if hasattr(user, 'user_type') else 'unknown'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'status': 'error',
                'message': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
