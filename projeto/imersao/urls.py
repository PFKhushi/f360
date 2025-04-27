from rest_framework.routers import DefaultRouter
from .views import ImersaoViewSet, TecnologiaViewSet, AreaFabricaViewSet, PalestraViewSet, FormularioInscricaoViewSet

router = DefaultRouter()

router.register('imersao', ImersaoViewSet, basename='imersao')
router.register('tecnologia', TecnologiaViewSet, basename='tecnologia')
router.register('area_fabrica', AreaFabricaViewSet, basename='area_fabrica')
router.register('palestra', PalestraViewSet, basename='palestra')
router.register('formulario_inscricao', FormularioInscricaoViewSet, basename='formulario_inscricao')



urlpatterns = []
urlpatterns += router.urls   
    