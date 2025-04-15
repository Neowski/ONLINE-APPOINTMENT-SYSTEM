from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True)
    first_name = serializers.CharField(required=True)
    middle_initial = serializers.CharField(required=False, allow_blank=True, max_length=1)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    user_type = serializers.ChoiceField(choices=User.USER_TYPE_CHOICES, required=True)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'middle_initial', 'last_name', 'email', 'password', 'user_type']

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        username = validated_data.pop('username')
        first_name = validated_data.pop('first_name')
        middle_initial = validated_data.pop('middle_initial', '')
        last_name = validated_data.pop('last_name')
        user = User.objects.create(username=username, **validated_data)
        user.first_name = first_name
        user.middle_initial = middle_initial
        user.last_name = last_name
        user.set_password(password)
        user.save()
        return user
