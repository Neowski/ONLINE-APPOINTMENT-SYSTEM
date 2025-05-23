from rest_framework import serializers
from .models import AdviserAvailability, CustomUser, Appointment
from django.core.exceptions import ValidationError

class CustomUserSerializer(serializers.ModelSerializer):
    sr_code = serializers.CharField(max_length=20, required=True)  # Add sr_code to the serializer

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'middle_name', 'last_name', 'user_type', 'sr_code']
        read_only_fields = ['id']

    def validate_email(self, value):
        school_email_domain = 'g.batstate-u.edu.ph'
        if not value.lower().endswith('@' + school_email_domain):
            raise serializers.ValidationError(f'Email must be a {school_email_domain} email address.')
        return value

    def create(self, validated_data):
        last_name = validated_data.get('last_name', '').strip()
        first_name = validated_data.get('first_name', '').strip()
        middle_name = validated_data.get('middle_name', '').strip()
        username_parts = [last_name.upper(), first_name.upper()]
        if middle_name:
            username_parts.append(middle_name.upper())
        username = ', '.join(username_parts)
        validated_data['username'] = username
        user = CustomUser.objects.create_user(**validated_data)
        return user

class AdviserAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = AdviserAvailability
        fields = ['id', 'adviser', 'date', 'time']
        read_only_fields = ['id']

class AppointmentSerializer(serializers.ModelSerializer):
    adviser = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(user_type='adviser')
    )
    student = serializers.StringRelatedField(read_only=True)
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = ['id', 'adviser', 'student', 'sr_code', 'date', 'time', 'reason', 'student_name']
        read_only_fields = ['id', 'student'] 

    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"
