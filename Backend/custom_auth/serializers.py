from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    middle_initial = serializers.CharField(required=False, allow_blank=True, max_length=1)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    user_type = serializers.ChoiceField(choices=User.USER_TYPE_CHOICES, required=True)

    class Meta:
        model = User
        fields = ['first_name', 'middle_initial', 'last_name', 'email', 'password', 'user_type']

    def create(self, validated_data):
        first_name = validated_data.pop('first_name')
        middle_initial = validated_data.pop('middle_initial', '')
        last_name = validated_data.pop('last_name')
        # Generate username in format: "LASTNAME, FIRSTNAME M."
        middle_initial_part = f" {middle_initial.upper()}." if middle_initial else ""
        username = f"{last_name.upper()}, {first_name.upper()}{middle_initial_part}"
        validated_data['username'] = username
        user = User.objects.create(**validated_data)
        user.first_name = first_name
        user.middle_initial = middle_initial
        user.last_name = last_name
        user.set_password(validated_data['password'])
        user.save()
        return user
