from django.urls import path
from . import views

app_name = 'painel_admin'

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('', views.painel_view, name='painel'),
]