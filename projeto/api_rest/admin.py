from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario


class CustomUserAdmin(UserAdmin):
    pass

#admin.site.register(Usuario, CustomUserAdmin)