from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'user_type']
        extra_kwargs = {
            'password': {'write_only': True}
        }
