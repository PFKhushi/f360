from django.urls import path
from api_rest import views
from rest_framework.routers import DefaultRouter
from api_rest.views import ParticipanteViewSet, EmpresaViewSet, TechLeaderViewSet, LoginUsuario, LogoutUsuario

router = DefaultRouter()
router.register('participante', ParticipanteViewSet, basename='participante')
router.register('empresa', EmpresaViewSet, basename='empresa')
router.register('techleader', TechLeaderViewSet, basename='techleader')


urlpatterns = [
    path('login/', LoginUsuario.as_view(), name='login_usuario'),
    path('logout/', LogoutUsuario.as_view(), name='logout_usuario'),
]


urlpatterns += router.urls
