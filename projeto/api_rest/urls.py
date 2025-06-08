from django.urls import path
from api_rest import views
from rest_framework.routers import DefaultRouter
from api_rest.views import ParticipanteViewSet, EmpresaViewSet, TechLeaderViewSet, LoginUsuario, LogoutUsuario, AdminCreateView, ExcecaoViewSet, ExtensionistaViewSet, UsuarioVS
router = DefaultRouter()
router.register('participante', ParticipanteViewSet, basename='participante')
router.register('empresa', EmpresaViewSet, basename='empresa')
router.register('techleader', TechLeaderViewSet, basename='techleader')
router.register('excecao', ExcecaoViewSet, basename='excecao')
router.register('extensionista', ExtensionistaViewSet, basename='extensionista')
router.register('usuario', UsuarioVS, basename='usuario')


urlpatterns = [
    path('login/', LoginUsuario.as_view(), name='login_usuario'),
    path("criar-admin/", AdminCreateView.as_view(), name="criar-admin"),
    path('logout/', LogoutUsuario.as_view(), name='logout_usuario'),
]


urlpatterns += router.urls
