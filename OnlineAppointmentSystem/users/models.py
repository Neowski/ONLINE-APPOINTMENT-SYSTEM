from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

import re
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.core.exceptions import ValidationError

def validate_school_email(email):
    # Adjust the domain to your school's domain
    school_email_domain = 'g.batstate-u.edu.ph'
    if not email.lower().endswith('@' + school_email_domain):
        raise ValidationError(f'Email must be a {school_email_domain} email address.')

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        validate_school_email(email)
        # Generate username from last_name, first_name, middle_name
        last_name = extra_fields.get('last_name', '').strip()
        first_name = extra_fields.get('first_name', '').strip()
        middle_name = extra_fields.get('middle_name', '').strip()
        username_parts = [last_name.upper(), first_name.upper()]
        if middle_name:
            username_parts.append(middle_name.upper())
        username = ', '.join(username_parts)
        extra_fields['username'] = username

        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('adviser', 'Adviser'),
    )

    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True, validators=[validate_school_email])
    first_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'user_type']

    def __str__(self):
        return self.username
    
class AdviserAvailability(models.Model):
    adviser = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Removed limit_choices_to constraint
    date = models.DateField()
    time = models.TimeField()

    class Meta:
        unique_together = ('adviser', 'date', 'time')
        ordering = ['date', 'time']

    def __str__(self):
        return f"{self.adviser.username} - {self.date} {self.time}"


class Appointment(models.Model):
    adviser = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='appointments_as_adviser')
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='appointments_as_student')
    sr_code = models.CharField(max_length=20)
    date = models.DateField()
    time = models.TimeField()
    reason = models.TextField()

    class Meta:
        unique_together = ('adviser', 'student', 'date', 'time')
        ordering = ['date', 'time']

    def __str__(self):
        return f"Appointment: {self.sr_code} - {self.student.username} with {self.adviser.username} on {self.date} at {self.time}"
