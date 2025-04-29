from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response 
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError


from imersao.models import Imersao, AreaFabrica, Tecnologia, InteresseArea, FormularioInscricao, Palestra, DiaWorkshop, Workshop, ParticipacaoImersao, PresencaPalestra, PresencaWorkshop, DesempenhoWorkshop
from imersao.serializers import (ImersaoSerializer, AreaFabricaSerializer, 
TecnologiaSerializer, InteresseAreaSerializer, FormularioInscricaoListSerializer,
FormularioInscricaoDetailSerializer, FormularioInscricaoCreateUpdateSerializer, 
PalestraSerializer, DiaWorkshopSerializer, WorkshopListSerializer, WorkshopDetailSerializer,
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
        # return Imersao.objects.order_by('-id').first()
        return Imersao.objects.all()
    
    
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
        # return [perm() for perm in permission_classes]
        return [permissions.AllowAny()] #############retirar depois###############

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('imersao.ver_todas_areas_fabrica'):
            return AreaFabrica.objects.all()
        # return AreaFabrica.objects.filter(active=True)
        return AreaFabrica.objects.all()
    
    
class TecnologiaViewSet(viewsets.ModelViewSet):

    queryset = Tecnologia.objects.all()
    serializer_class = TecnologiaSerializer

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
        if user.is_staff or user.has_perm('imersao.ver_todas_tecnologias'):
            return Tecnologia.objects.all()
        # return Tecnologia.objects.filter(ativa=True)
        return Tecnologia.objects.all()
    
    
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
        # return AreaFabrica.objects.filter(ativa=True)
        return Palestra.objects.all()
    

class FormularioInscricaoViewSet(viewsets.ModelViewSet):

    queryset = FormularioInscricao.objects.all()
    # serializer_class = FormularioInscricaoCreateUpdateSerializer

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
        if user.is_staff or user.has_perm('imersao.ver_todas_inscricoes'):
            return FormularioInscricao.objects.all()
        # return AreaFabrica.objects.filter(ativa=True)
        return FormularioInscricao.objects.all()  
    
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
        # return [perm() for perm in permission_classes]
        return [permissions.AllowAny()] #############retirar depois###############

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('imersao.ver_todas_interesses_area'):
            return InteresseArea.objects.all()
        # return AreaFabrica.objects.filter(ativa=True)
        return InteresseArea.objects.all()
    
    
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
        # return [perm() for perm in permission_classes]
        return [permissions.AllowAny()] #############retirar depois###############

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('imersao.ver_presencas_palestras'):
            return PresencaPalestra.objects.all()
        # return Palestra.objects.filter(ativa=True)
        return PresencaPalestra.objects.all()
    
class ParticipacaoImersaoViewSet(viewsets.ModelViewSet):

    queryset = ParticipacaoImersao.objects.all()
    serializer_class = ParticipacaoImersaoSerializer

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
        if user.is_staff or user.has_perm('imersao.ver_participacoes_imersao'):
            return ParticipacaoImersao.objects.all()
        # return ParticipacaoImersao.objects.filter(ativa=True)
        return ParticipacaoImersao.objects.all()