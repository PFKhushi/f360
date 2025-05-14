from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response 
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError

from api_rest.models import Participante
from imersao.models import Imersao, AreaFabrica, Tecnologia, InteresseArea, FormularioInscricao, Palestra, DiaWorkshop, Workshop, ParticipacaoImersao, PresencaPalestra, PresencaWorkshop, DesempenhoWorkshop, InstrutorWorkshop
from imersao.serializers import (ImersaoSerializer, AreaFabricaSerializer, 
TecnologiaSerializer, InteresseAreaSerializer, FormularioInscricaoListSerializer,
FormularioInscricaoDetailSerializer, FormularioInscricaoCreateUpdateSerializer, 
PalestraSerializer, DiaWorkshopSerializer, WorkshopListSerializer, WorkshopDetailSerializer, WorkshopCreateUpdateSerializer, InstrutorWorkshopSerializer,
ParticipacaoImersaoSerializer, PresencaPalestraSerializer, PresencaWorkshopSerializer,
DesempenhoWorkshopSerializer, FormularioInscricaoPorImersaoSerializer, ParticipanteDesempenhoSerializer,
EstatisticasImersaoSerializer)

# Create your views here.
class ImersaoViewSet(viewsets.ModelViewSet):

    queryset = Imersao.objects.all()
    serializer_class = ImersaoSerializer

    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        # return [perm() for perm in permission_classes]
        return [permissions.AllowAny()]  #############retirar depois###############

    def get_queryset(self):
        user = self.request.user
        
        if user.is_staff or user.has_perm('imersao.ver_todas_imersoes'):
            return Imersao.objects.all()
        if hasattr(user, 'participante'):
            return Imersao.objects.filter(
                participantes_imersao__participante=user.participante
            ).prefetch_related('participantes_imersao__participante')
        
        return Imersao.objects.filter(ativa=True)
    
    
class AreaFabricaViewSet(viewsets.ModelViewSet):

    queryset = AreaFabrica.objects.all()
    serializer_class = AreaFabricaSerializer

    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        return [perm() for perm in permission_classes]
        # return [permissions.AllowAny()] #############retirar depois###############

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('imersao.ver_todas_areas_fabrica'):
            return AreaFabrica.objects.all()
        return AreaFabrica.objects.filter(active=True)
        # return AreaFabrica.objects.all()
    
    
class TecnologiaViewSet(viewsets.ModelViewSet):

    queryset = Tecnologia.objects.all()
    serializer_class = TecnologiaSerializer

    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        return [perm() for perm in permission_classes]
        # return [permissions.AllowAny()] #############retirar depois###############

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('imersao.ver_todas_tecnologias'):
            return Tecnologia.objects.all()
        return Tecnologia.objects.filter(ativa=True)
        # return Tecnologia.objects.all()
    
    
class PalestraViewSet(viewsets.ModelViewSet):

    queryset = Palestra.objects.all()
    serializer_class = PalestraSerializer

    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        # return [perm() for perm in permission_classes]
        return [permissions.AllowAny()] #############retirar depois###############

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('imersao.ver_todas_palestras'):
            return Palestra.objects.all()
        ultima_imersao = Imersao.objects.order_by('-ano', '-semestre').first()
        if ultima_imersao:
            return Palestra.objects.filter(imersao=ultima_imersao.id)
        return Palestra.objects.none()    

class FormularioInscricaoViewSet(viewsets.ModelViewSet):

    queryset = FormularioInscricao.objects.all()
    # serializer_class = FormularioInscricaoCreateUpdateSerializer

    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        # return [perm() for perm in permission_classes]
        return [permissions.AllowAny()] #############retirar depois###############

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('imersao.ver_todas_inscricoes'):
            return FormularioInscricao.objects.all()
        form_imersionista = Participante.objects.filter(usuario=user.id)
        return FormularioInscricao.objects.filter(participante=form_imersionista.id)
        # return FormularioInscricao.objects.all()  
    
    def get_serializer_class(self):
        if self.action == 'list':
            return FormularioInscricaoListSerializer
        elif self.action == 'retrieve':
            return FormularioInscricaoDetailSerializer
        else:  # create, update, partial_update, destroy
            return FormularioInscricaoCreateUpdateSerializer

class InteresseAreaViewSet(viewsets.ModelViewSet):

    queryset = InteresseArea.objects.all()
    serializer_class = InteresseAreaSerializer

    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        return [perm() for perm in permission_classes]
        # return [permissions.AllowAny()] #############retirar depois###############

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('imersao.ver_todas_interesses_area'):
            return InteresseArea.objects.all()
        return InteresseArea.objects.none()
        # return InteresseArea.objects.all()
        
    
class PresencaPalestraViewSet(viewsets.ModelViewSet):

    queryset = PresencaPalestra.objects.all()
    serializer_class = PresencaPalestraSerializer

    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        return [perm() for perm in permission_classes]
        # return [permissions.AllowAny()] #############retirar depois###############

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('imersao.ver_presencas_palestras'):
            return PresencaPalestra.objects.all()
        # return Palestra.objects.filter(ativa=True)
        return Palestra.objects.none()
    
class ParticipacaoImersaoViewSet(viewsets.ModelViewSet):

    queryset = ParticipacaoImersao.objects.all()
    serializer_class = ParticipacaoImersaoSerializer

    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        return [perm() for perm in permission_classes]
        # return [permissions.AllowAny()] #############retirar depois###############

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('imersao.ver_participacoes_imersao'):
            return ParticipacaoImersao.objects.all()
        return ParticipacaoImersao.objects.none()
        # return ParticipacaoImersao.objects.all()
        
        
class DiaWorkshopViewSet(viewsets.ModelViewSet):
    
    serializer_class = DiaWorkshopSerializer
    
    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        return [perm() for perm in permission_classes]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('imersao.ver_dias_workshop'):
            return DiaWorkshop.objects.all()
        return DiaWorkshop.objects.none()
        # return ParticipacaoImersao.objects.all()

class PresencaWorkshopViewSet(viewsets.ModelViewSet):
    serializer_class = PresencaWorkshopSerializer
    
    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        return [perm() for perm in permission_classes]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('imersao.ver_presencas_workshop'):
            return PresencaWorkshop.objects.all()
        return PresencaWorkshop.objects.none()
        # return ParticipacaoImersao.objects.all()
    
class DesempenhoWorkshopViewSet(viewsets.ModelViewSet):
    serializer_class = DesempenhoWorkshopSerializer
    
    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        return [perm() for perm in permission_classes]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('imersao.ver_desempenhos_workshop'):
            return DesempenhoWorkshop.objects.all()
        return DesempenhoWorkshop.objects.none()
        # return DesempenhoWorkshop.objects.all()
    
class WorkshopViewSet(viewsets.ModelViewSet):

    
    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        return [perm() for perm in permission_classes]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('imersao.ver_workshops'):
            return Workshop.objects.all()
        return Workshop.objects.none()
        # return Workshop.objects.all()
        
    def get_serializer_class(self):
        if self.action == 'list':
            return WorkshopListSerializer
        elif self.action == 'retrieve':
            return WorkshopDetailSerializer
        else:  # create, update, partial_update, destroy
            return WorkshopCreateUpdateSerializer
    
class InstrutorViewSet(viewsets.ModelViewSet):
    serializer_class = InstrutorWorkshopSerializer
    
    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        return [perm() for perm in permission_classes]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('imersao.ver_instrutores_workshop'):
            return InstrutorWorkshop.objects.all()
        return InstrutorWorkshop.objects.none()
        # return InstrutorWorkshop.objects.all()