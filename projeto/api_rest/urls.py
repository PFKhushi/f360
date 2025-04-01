from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [
    path('login', views.login_user, name='login_user'),
    path('register', views.register_user, name='register_user'),
    path('all_users', views.user_profile, name='user_profile'),
    path('user/<int:user_id>', views.manage_user_by_id, name='manage_user_by_id'),
]