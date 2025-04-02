from django.contrib import admin
from django.urls import path, include


from . import views

# urlpatterns = [
#     path('login', views.login_user, name='login_user'),
#     path('register', views.register_user, name='register_user'),
#     path('all_users', views.user_profile, name='user_profile'),
#     path('user/<int:user_id>', views.manage_user_by_id, name='manage_user_by_id'),
# ]

urlpatterns = [
    path("user/list/",views.UsuarioList.as_view(), name="lista_usuario" ),
    path("user/login/",views.LoginUsuario.as_view(), name="logar_usuario" ),
    path('user/register/', views.CriarUsuario.as_view(), name="registrar_usuario" ),
    path('user/<str:username>/edit/', views.EditarUsuario.as_view(), name="editar_usuario" ),
    # talvez uma rota para deletar usuário, mas 
    # imagino q as boas praticas digam para manter o 
    # usuário e só desativar o acesso
    
]
