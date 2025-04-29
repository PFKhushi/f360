from rest_framework.routers import DefaultRouter
from .views import ImersaoViewSet, TecnologiaViewSet, AreaFabricaViewSet, PalestraViewSet, FormularioInscricaoViewSet, InteresseAreaViewSet, PresencaPalestraViewSet, ParticipacaoImersaoViewSet

router = DefaultRouter()

router.register('imersao', ImersaoViewSet, basename='imersao')
router.register('tecnologia', TecnologiaViewSet, basename='tecnologia')
router.register('area_fabrica', AreaFabricaViewSet, basename='area_fabrica')
router.register('palestra', PalestraViewSet, basename='palestra')
router.register('formulario_inscricao', FormularioInscricaoViewSet, basename='formulario_inscricao')
router.register('interesse_area', InteresseAreaViewSet, basename='interesse_area') # Retirar depois
router.register('presenca_palestra', PresencaPalestraViewSet, basename='presenca_palestra')
router.register('participacao_imersao', ParticipacaoImersaoViewSet, basename='participacao_imersao')



urlpatterns = []
urlpatterns += router.urls   
    