from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import iteracaoViewSet, ImersaoViewSet, TecnologiaViewSet, AreaFabricaViewSet, PalestraViewSet, FormularioInscricaoViewSet, InteresseAreaViewSet, PresencaPalestraViewSet, ParticipacaoImersaoViewSet, WorkshopViewSet, DesempenhoWorkshopViewSet, PresencaWorkshopViewSet, ImersionistaViewSet, DiaWorkshopViewSet, EmailsParticipantesViewSet, EmailsAdminsViewSet, EmailsFixosViewSet

router = DefaultRouter()

router.register(r'iteracao', iteracaoViewSet, basename='iteracao')
router.register('imersao', ImersaoViewSet, basename='imersao')
router.register('tecnologia', TecnologiaViewSet, basename='tecnologia')
router.register('area_fabrica', AreaFabricaViewSet, basename='area_fabrica')
router.register('palestra', PalestraViewSet, basename='palestra')
router.register('formulario_inscricao', FormularioInscricaoViewSet, basename='formulario_inscricao')
router.register('interesse_area', InteresseAreaViewSet, basename='interesse_area') # Retirar depois
router.register('presenca_palestra', PresencaPalestraViewSet, basename='presenca_palestra')
router.register('participacao_imersao', ParticipacaoImersaoViewSet, basename='participacao_imersao')
router.register('workshop', WorkshopViewSet, basename='workshop')
router.register('desempenho_workshop', DesempenhoWorkshopViewSet, basename='desempenho_workshop')
router.register('presenca_workshop', PresencaWorkshopViewSet, 'presenca_workshop')
router.register('imersionista', ImersionistaViewSet, 'imersionista')
router.register('dia_workshop', DiaWorkshopViewSet, 'dia_workshop')
router.register('emails_participantes', EmailsParticipantesViewSet, basename='emails_participantes')
router.register('emails_admins', EmailsAdminsViewSet, basename='emails_admins')
router.register('emails_membros', EmailsFixosViewSet, basename='emails_membros')




urlpatterns = [
    # path('imersionistas/', ImersiolnistaAPIView.as_view(), name='imersionistas'),
]
urlpatterns += router.urls   
