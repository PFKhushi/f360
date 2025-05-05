from rest_framework import generics, permissions, status, viewsets, serializers
from rest_framework.response import Response 
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import NotFound
from rest_framework.exceptions import APIException, PermissionDenied
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import Http404
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404

from drf_spectacular.utils import extend_schema_view

from rest_framework.views import APIView  
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from .models import Usuario, Participante, TechLeader, Empresa, Excecao, Extensionista
from .serializers import UsuarioSerializer, ParticipanteSerializer, TechLeaderSerializer, EmpresaSerializer, CustomTokenSerializer, AdminCreateSerializer, ExcecaoSerializer, ExtensionistaSerializer
from .permissoes import IsOwnerOrAdmin
from .swagger import (list_participantes_swagger, update_participantes_swagger,
                    create_participantes_swagger, retrieve_participantes_swagger, 
                    partial_update_participantes_swagger, delete_participantes_swagger,

                    list_techleaders_swagger, update_techleaders_swagger,
                    create_techleaders_swagger, retrieve_techleaders_swagger,
                    partial_update_techleaders_swagger, delete_techleaders_swagger,

                    list_empresas_swagger, update_empresas_swagger,
                    create_empresas_swagger, retrieve_empresas_swagger,
                    partial_update_empresas_swagger, delete_empresas_swagger,
                    )
import logging

logger = logging.getLogger(__name__)

class ErrorHandlingMixin:
    
    def handle_exception(self, exc):

        # Log pra debugging
        logger.error(
            f"Erro na requisição {self.request.method} {self.request.path}",
            exc_info=exc,
            extra={
                'user': str(self.request.user),
                'data': self.request.data
            }
        )

        if isinstance(exc, serializers.ValidationError):
            return self._handle_validation_error(exc)
        elif isinstance(exc, ValidationError):  
            return self._handle_django_validation_error(exc)
        elif isinstance(exc, IntegrityError):
            return self._handle_integrity_error(exc)
        elif isinstance(exc, PermissionDenied):
            return self._handle_permission_error(exc)
        elif isinstance(exc, (Http404, NotFound)):
            return self._handle_not_found_error(exc)    
        elif isinstance(exc, APIException):
            return self._handle_api_exception(exc)
        else:
            return self._handle_unexpected_error(exc)

    def _handle_validation_error(self, exc):
        return Response(
            {
                "erro": "Erro de validação nos dados enviados",
                "codigo": status.HTTP_400_BAD_REQUEST,
                "detalhes": exc.detail
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    def _handle_django_validation_error(self, exc):
        return Response(
            {
                "erro": "Erro de validação",
                "codigo": status.HTTP_400_BAD_REQUEST,
                "detalhes": exc.message_dict if hasattr(exc, 'message_dict') else str(exc)
            },
            status=status.HTTP_400_BAD_REQUEST
        )
        
    def _handle_not_found_error(self, exc):
        return Response(
            {
                "erro": "Recurso não encontrado",
                "codigo": status.HTTP_404_NOT_FOUND,
                "detalhes": str(exc)
            },
            status=status.HTTP_404_NOT_FOUND
        )

    def _handle_integrity_error(self, exc):
        error_detail = str(exc)
        if 'username' in error_detail:
            detail = {"email": ["Este email já está em uso"]}
        elif 'cpf' in error_detail:
            detail = {"cpf": ["Este CPF já está cadastrado"]}
        elif 'cnpj' in error_detail:
            detail = {"cnpj": ["Este CNPJ já está cadastrado"]}
        elif 'rgm' in error_detail:
            detail = {"rgm": ["Este RGM já está cadastrado"]}
        elif 'email_institucional' in error_detail:
            detail = {"email_institucional": ["Este email institucional já está em uso"]}
        elif 'unique constraint' in error_detail:
            detail = {"unique": ["Este campo deve ser único"]}
        else:
            detail = {"database": ["Violação de restrição no banco de dados"]}

        return Response(
            {
                "erro": "Violação de integridade de dados",
                "codigo": status.HTTP_409_CONFLICT,
                "detalhes": detail
            },
            status=status.HTTP_409_CONFLICT
        )

    def _handle_permission_error(self, exc):
        return Response(
            {
                "detail": str(exc) or "Você não tem permissão para acessar este recurso."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    def _handle_api_exception(self, exc):
        return Response(
            {
                "erro": exc.default_detail,
                "codigo": exc.status_code,
                "detalhes": exc.get_full_details()
            },
            status=exc.status_code
        )

    def _handle_unexpected_error(self, exc):
        request_id = self.request.META.get('X-Request-ID', 'unknown')
        
        return Response(
            {
                "erro": "Erro inesperado no servidor",
                "codigo": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "requisicao_id": request_id,
                "detalhes": "Consulte o administrador do sistema com o ID da requisição"
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class LoginUsuario(TokenObtainPairView):
    
    serializer_class = CustomTokenSerializer

# view de logout, invalida o refresh token
class LogoutUsuario(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()  # invalida token
                return Response({"detail": "Logout realizado com sucesso!"}, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Refresh token nao fornecido."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": "Erro ao fazer logout"}, status=status.HTTP_400_BAD_REQUEST)

class AdminCreateView(APIView):
    permission_classes = [permissions.AllowAny]  # Mude para IsAdminUser após criar o primeiro admin

    def post(self, request):
        serializer = AdminCreateSerializer(data=request.data)
        if serializer.is_valid():
            admin = serializer.save()
            return Response(serializer.to_representation(admin), status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# view q gerencia CRUD de Participantes
class ParticipanteViewSet(ErrorHandlingMixin, viewsets.ModelViewSet):

    queryset = Participante.objects.all()
    serializer_class = ParticipanteSerializer
    
    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        # return [permissions.AllowAny()] #############retirar depois###############
        return [perm() for perm in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('api_rest.ver_todos_participantes'):
            return Participante.objects.all()
        # return Participante.objects.all() #############retirar depois###############
        return Participante.objects.filter(usuario=user)  # user so ve seu perfil

    def _get_participante(self, pk):
        try:
            return Participante.objects.get(pk=pk)
        except Participante.DoesNotExist:
            raise Http404("Participante não encontrado com o ID fornecido.")

    def _handle_serialization(self, participante, data=None, partial=False):
        serializer = self.get_serializer(participante, data=data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Usando a função genérica para diferentes ações
    @update_participantes_swagger()
    def update(self, request, *args, **kwargs):
        participante = self._get_participante(kwargs['pk'])
        return self._handle_serialization(participante, data=request.data)

    @list_participantes_swagger()
    def list(self, request, *args, **kwargs):
        participantes = self.get_queryset() 
        serializer = self.get_serializer(participantes, many=True)
        return Response(serializer.data)

    @retrieve_participantes_swagger()
    def retrieve(self, request, *args, **kwargs):
        participante = self._get_participante(kwargs['pk'])
        serializer = self.get_serializer(participante)
        return Response(serializer.data)

    @partial_update_participantes_swagger()
    def partial_update(self, request, *args, **kwargs):
        participante = self._get_participante(kwargs['pk'])
        return self._handle_serialization(participante, data=request.data, partial=True)

    @create_participantes_swagger()
    def create(self, request, *args, **kwargs):
        return self._handle_serialization(None, data=request.data)

    @delete_participantes_swagger()
    def destroy(self, request, *args, **kwargs):
        # Anonimizar o usuario
        participante = self._get_participante(kwargs['pk'])
        participante.usuario.delete()
        participante.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    


# view p/ techleaders, mesma estrutura da view de participantes
class TechLeaderViewSet(ErrorHandlingMixin, viewsets.ModelViewSet):
    queryset = TechLeader.objects.all()
    serializer_class = TechLeaderSerializer

    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        # return [permissions.AllowAny()] #############retirar depois###############
        return [perm() for perm in permission_classes]

    def get_queryset(self):
        
        user = self.request.user
        if user.is_staff or user.has_perm('api_rest.ver_todos_techleaders'):
            return TechLeader.objects.all()
        # return TechLeader.objects.all()#############retirar depois###############
        return TechLeader.objects.filter(usuario=user)

    def _get_techleader(self, pk):
        try:
            return TechLeader.objects.get(pk=pk)
        except TechLeader.DoesNotExist:
            raise Http404("Tech Leader não encontrado com o ID fornecido.")

    def _handle_serialization(self, techleader, data=None, partial=False):
        serializer = self.get_serializer(techleader, data=data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @update_techleaders_swagger()
    def update(self, request, *args, **kwargs):
        
        techleader = self._get_techleader(kwargs['pk'])
        return self._handle_serialization(techleader, data=request.data)

    @list_techleaders_swagger()
    def list(self, request, *args, **kwargs):

        techleaders = self.get_queryset() 
        serializer = self.get_serializer(techleaders, many=True)
        return Response(serializer.data)

    @retrieve_techleaders_swagger()
    def retrieve(self, request, *args, **kwargs):

        techleader = self._get_techleader(kwargs['pk'])
        serializer = self.get_serializer(techleader)
        return Response(serializer.data)

    @partial_update_techleaders_swagger()
    def partial_update(self, request, *args, **kwargs):

        techleader = self._get_techleader(kwargs['pk'])
        return self._handle_serialization(techleader, data=request.data, partial=True)

    @create_techleaders_swagger()
    def create(self, request, *args, **kwargs):
        
        return self._handle_serialization(None, data=request.data)

    @delete_techleaders_swagger()
    def destroy(self, request, *args, **kwargs):
        # Anonimizar o usuario        
        techleader = self._get_techleader(kwargs['pk'])
        techleader.usuario.delete()
        techleader.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
# view p/ empresas, logica identica mudando os campos do perfil
class EmpresaViewSet(ErrorHandlingMixin, viewsets.ModelViewSet):

    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer

    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        # return [permissions.AllowAny()] #############retirar depois###############
        return [perm() for perm in permission_classes]

    def get_queryset(self):
        
        user = self.request.user
        if user.is_staff or user.has_perm('api_rest.ver_todas_empresas'):
            return Empresa.objects.all()
        # return Empresa.objects.all()#############retirar depois###############
        return Empresa.objects.filter(usuario=user)
    
    def _get_empresa(self, pk):
        try:
            return Empresa.objects.get(pk=pk)
        except Empresa.DoesNotExist:
            raise Http404("Empresa não encontrado com o ID fornecido.")

    def _handle_serialization(self, empresa, data=None, partial=False):
        serializer = self.get_serializer(empresa, data=data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @update_empresas_swagger()
    def update(self, request, *args, **kwargs):
        
        empresa = self._get_empresa(kwargs['pk'])
        return self._handle_serialization(empresa, data=request.data)

    @list_empresas_swagger()
    def list(self, request, *args, **kwargs):
        
        empresas = self.get_queryset() 
        serializer = self.get_serializer(empresas, many=True)
        return Response(serializer.data)

    @retrieve_empresas_swagger()
    def retrieve(self, request, *args, **kwargs):
        
        empresa = self._get_empresa(kwargs['pk'])
        serializer = self.get_serializer(empresa)
        return Response(serializer.data)

    @partial_update_empresas_swagger()
    def partial_update(self, request, *args, **kwargs):
        
        empresa = self._get_empresa(kwargs['pk'])
        return self._handle_serialization(empresa, data=request.data, partial=True)

    @create_empresas_swagger()
    def create(self, request, *args, **kwargs):
        return self._handle_serialization(None, data=request.data)

    @delete_empresas_swagger()
    def destroy(self, request, *args, **kwargs):
        # Anonimizar o usuario
        empresa = self._get_empresa(kwargs['pk'])
        empresa.usuario.delete()
        empresa.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ExcecaoViewSet(ErrorHandlingMixin, viewsets.ModelViewSet):
    queryset = Excecao.objects.all()
    serializer_class = ExcecaoSerializer
    
    def get_permissions(self):
        
        if self.action == 'create':
            permissions_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permissions_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        else:
            permissions_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        return [perm() for perm in permissions_classes]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('api_rest.ver_todas_excecoes'):
            return Excecao.objects.all()
        # return Excecao.objects.all()#############retirar depois###############
        return Excecao.objects.filter(usuario=user)
    
    def _get_excecao(self, pk):
        try:
            return Excecao.objects.get(pk=pk)
        except Excecao.DoesNotExist:
            raise Http404("Participante não encontrado com o ID fornecido.")
            
    def _handle_serialization(self, excecao, data=None, partial=False):
        serializer = self.get_serializer(excecao, data=data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        excecao = self._get_excecao(kwargs['pk'])
        return self._handle_serialization(excecao, data=request.data)
    
    def list(self, request, *args, **kwargs):
        excecao = self.get_queryset()
        serializer = self.get_serializer(excecao, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, *args, **kwargs):
        excecao =self._get_excecao(kwargs['pk'])
        serializer = self.get_serializer(excecao)
        return Response(serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        excecao = self._get_excecao(kwargs['pk'])
        return self._handle_serialization(excecao, data=request.data, partial=True)
    
    def create(self, request, *args, **kwargs):
        return self._handle_serialization(None, data=request.data)
    
    def destroy(self, request, *args, **kwargs):
        # Anonimizar usuario
        excecao = self._get_excecao(kwargs['pk'])
        excecao.usuario.delete()
        excecao.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ExtensionistaViewSet(ErrorHandlingMixin, viewsets.ModelViewSet):
    queryset = Extensionista.objects.all()
    serializer_class = ExtensionistaSerializer
    
    def get_permissions(self):
        return [permissions.IsAuthenticated, permissions.IsAdminUser]
    
    def get_queryset(self):
        return Extensionista.objects.all()
    
    def _get_extensionista(self, pk):
        try:
            return Extensionista.objects.get(pk=pk)
        except Extensionista.DoesNotExist:
            raise Http404("Extensionista não encontrado com o ID fornecido.")
        
    def _handle_serialization(self, extensionista, data=None, partial=False):
        serializer = self.get_serializer(extensionista, data=data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def update(self, request, *args, **kwargs):
        extensionista = self._get_extensionista(kwargs['pk'])
        return self._handle_serialization(extensionista, data=request.data)
    
    def list(self, request, *agrs, **kwargs):
        extensionista = self.get_queryset()
        serializer = self.get_serializer(extensionista, many=True)
        return Response(serializer.data)
    
    def retrive(self, request, *agrs, **kwargs):
        extensionista = self._get_extensionista(kwargs['pk'])
        serializer = self.get_serializer(extensionista)
        return Response(serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        extensionista = self._get_extensionista(kwargs['pk'])
        serializer = self._handle_serialization(extensionista, data=request.data, partial=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        return self._handle_serialization(None, data=request.data)
        
    def destroy(self, request, *args, **kwargs):
        extensionista = self._get_extensionista(kwargs['pk'])
        extensionista.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)