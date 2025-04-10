from django.urls import path
from .views import LoginView, RegisterView, UserDeleteView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'), 
    path('users/<str:username>/', UserDeleteView.as_view(), name='delete-user'),
]