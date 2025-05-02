from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'sr_code', 'first_name', 'last_name', 'user_type', 'is_staff', 'is_active')
    list_filter = ('user_type', 'is_staff', 'is_active')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {
            'fields': ('sr_code', 'first_name', 'middle_name', 'last_name', 'user_type')
        }),
        ('Permissions', {
            'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Important dates', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 'sr_code', 'first_name', 'middle_name', 'last_name',
                'user_type', 'password1', 'password2', 'is_staff', 'is_active'
            ),
        }),
    )

    search_fields = ('email', 'sr_code', 'first_name', 'last_name')
    ordering = ('email',)

    def save_model(self, request, obj, form, change):
        # Auto-generate username from name fields
        last_name = obj.last_name.strip().upper()
        first_name = obj.first_name.strip().upper()
        middle_name = obj.middle_name.strip().upper() if obj.middle_name else ''
        username_parts = [last_name, first_name]
        if middle_name:
            username_parts.append(middle_name)
        obj.username = ', '.join(username_parts)
        super().save_model(request, obj, form, change)

admin.site.register(CustomUser, CustomUserAdmin)
