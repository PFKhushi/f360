from django.urls import path
from api_rest import views
from rest_framework.routers import DefaultRouter
from api_rest.views import ParticipanteList

router = DefaultRouter()
router.register('participantes', ParticipanteList, basename='participantes')
urlpatterns = router.urls






# urlpatterns = [
#     path('login', views.login_user, name='login_user'),
#     path('register', views.register_user, name='register_user'),
#     path('all_users', views.user_profile, name='user_profile'),
#     path('user/<int:user_id>', views.manage_user_by_id, name='manage_user_by_id'),
# ]

from django.urls import path
from api_rest import views

# urlpatterns = [
#     # Rotas de Autenticação
#     path('user/login/', views.LoginUsuario.as_view(), name='login_usuario'),
#     path('user/logout/', views.LogoutUsuario.as_view(), name='logout_usuario'),#Invalida sessões JWT

#     # CRUD de Usuários
#     path('user/register/', views.CriarUsuario.as_view(), name='registrar_usuario'),
#     path('user/list/', views.UsuarioList.as_view(), name='lista_usuario'),
#     path('user/<int:id>/edit/', views.EditarUsuario.as_view(), name='editar_usuario'),  

#     # Perfil do Usuário
#     path('user/me/', views.UsuarioAtual.as_view(), name='usuario_atual'), #Substitui a necessidade de passar ID/Username
#     path('user/password/', views.AlterarSenha.as_view(), name='alterar_senha'),#Fluxo seguro de troca de senha
# ]

