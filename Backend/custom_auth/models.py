from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('adviser', 'Adviser'),
        ('admin', 'Admin'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    middle_initial = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        app_label = 'custom_auth'
        db_table = 'custom_auth_user'
