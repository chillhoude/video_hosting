from django.contrib import admin
from .models import CustomUser
from django.contrib.auth.admin import UserAdmin

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'is_moderator', 'is_active',)
    fieldsets = (
        ('Account', {'fields': ('username','password','avatar')}),
        ('Personal Data', {'fields': ('first_name','last_name', 'email','subscribers')}),
        ('Permissions', {'fields': ('is_staff','is_superuser','is_moderator', 'is_active')}),
        ('Date', {'fields': ('last_login','date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'is_moderator', 'is_active')}
        ),
    )
    search_fields = ('username',)
    ordering = ('username',)
