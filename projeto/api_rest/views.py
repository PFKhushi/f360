from rest_framework import generics, permissions, status, viewsets, serializers
from rest_framework.response import Response 
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import NotFound, APIException, PermissionDenied, NotAuthenticated

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


def resposta_json(sucesso=False, resultado=None, erro='', detalhes=[]):
    print("Tratando resposta")
    return {
        'sucesso': sucesso,
        'resultado': resultado,
        'erro': erro,
        'detalhes': detalhes
    }

class ErrorHandlingMixin():
    
    def handle_exception(self, exc):
        print("handle_exception")

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
        elif isinstance(exc, NotAuthenticated):
            return self._handle_authentication_error(exc)
        elif isinstance(exc, APIException):
            return self._handle_api_exception(exc)
        else:
            return self._handle_unexpected_error(exc)
        
    def _flatten_error_messages(self, detail):
        if isinstance(detail, dict):
            messages = []
            for field_name, field_errors in detail.items():
                if isinstance(field_errors, list):
                    for error in field_errors:
                        if hasattr(error, 'string'): 
                            messages.append(error.string)
                        else:
                            messages.append(str(error))
                elif isinstance(field_errors, dict):
                    nested_messages = self._flatten_error_messages(field_errors)
                    messages.extend(nested_messages)
                else:
                    messages.append(str(field_errors))
            return messages
        elif isinstance(detail, list):
            messages = []
            for item in detail:
                if isinstance(item, dict):
                    nested_messages = self._flatten_error_messages(item)
                    messages.extend(nested_messages)
                elif hasattr(item, 'string'):  
                    messages.append(item.string)
                else:
                    messages.append(str(item))
            return messages
        else:
            if hasattr(detail, 'string'):
                return [detail.string]
            return [str(detail)]

    def _handle_authentication_error(self, exc):
        return Response(resposta_json(
            erro="Acesso não autorizado",
            detalhes=self._flatten_error_messages(exc)),
            status=status.HTTP_401_UNAUTHORIZED
            )
    
    def _handle_validation_error(self, exc):
        print("_handle_validation_error")
        return Response(
            resposta_json(
                erro="Erro de validação nos dados enviados", 
                detalhes=self._flatten_error_messages(exc.detail)),
            status=status.HTTP_400_BAD_REQUEST
        )

    def _handle_django_validation_error(self, exc):
        print("_handle_django_validation_error")
        return Response(
            resposta_json(
                erro="Erro de validação", 
                detalhes=self._flatten_error_messages(exc.message_dict) if hasattr(exc, 'message_dict') else self._flatten_error_messages(str(exc))),
            status=status.HTTP_400_BAD_REQUEST
        )
        
    def _handle_not_found_error(self, exc):
        print("_handle_not_found_error")
        return Response(
            resposta_json(
                erro='Recurso não encontrado', 
                detalhes=self._flatten_error_messages(str(exc))),
            status=status.HTTP_404_NOT_FOUND
        )

    def _handle_integrity_error(self, exc):
        print("_handle_integrity_error")
        error_detail = str(exc)
        if 'username' in error_detail:
            detail = "Este email já está em uso"
        elif 'cpf' in error_detail:
            detail = "Este CPF já está cadastrado"
        elif 'cnpj' in error_detail:
            detail = "Este CNPJ já está cadastrado"
        elif 'rgm' in error_detail:
            detail = "Este RGM já está cadastrado"
        elif 'email_institucional' in error_detail:
            detail = "Este email institucional já está em uso"
        elif 'unique constraint' in error_detail:
            detail = "Este campo deve ser único"
        else:
            detail = "Violação de restrição no banco de dados"

        return Response(
            resposta_json(
                erro="Violação de integridade de dados", 
                detalhes=detail),
            status=status.HTTP_409_CONFLICT
        )

    def _handle_permission_error(self, exc):
        print("_handle_permission_error")
        return Response(
            resposta_json(
                erro="Não autorizado", 
                detalhes=self._flatten_error_messages(str(exc)) or "Você não tem permissão para acessar este recurso."),
            status=status.HTTP_403_FORBIDDEN
        )

    def _handle_api_exception(self, exc):
        print("_handle_api_exception")
        return Response(
            resposta_json(
                erro=exc.default_detail, 
                detalhes=exc.get_full_details()),
            status=exc.status_code
        )

    def _handle_unexpected_error(self, exc):
        print("_handle_unexpected_error")
        request_id = self.request.META.get('X-Request-ID', 'unknown')
        
        return Response(
            resposta_json(
                erro="Erro inesperado no servidor", 
                detalhes=f"Consulte o administrador do sistema com o ID da requisição - id={request_id}"),
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        

class LoginUsuario(ErrorHandlingMixin, TokenObtainPairView):
    
    serializer_class = CustomTokenSerializer

    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)  
        except Exception as exc:
            return self.handle_exception(exc)

# view de logout, invalida o refresh token
class LogoutUsuario(APIView):

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()  # invalida token
                return Response({"detail": "Logout realizado com sucesso!", "sucesso": True}, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Refresh token nao fornecido.", "sucesso": False}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": "Erro ao fazer logout", "sucesso": False}, status=status.HTTP_400_BAD_REQUEST)

class AdminCreateView(APIView):
    permission_classes = [permissions.AllowAny] # rota placeholder

    def post(self, request):
        print(1)
        serializer = AdminCreateSerializer(data=request.data)
        print(2)
        
        try:
            print("try")
            serializer.is_valid()
            admin = serializer.save()
            return Response(resposta_json(sucesso=True, resultado=serializer.to_representation(admin)), status=status.HTTP_201_CREATED)
        
        except:  
            print("except")
            return Response(resposta_json(
                erro="Erro de validação nos dados enviados", 
                detalhes=["Já existe um usuário com esse e-mail."]), status=status.HTTP_400_BAD_REQUEST)

def _handle_serialization(context, instance, data=None, partial=False):
    
    serializer = context.get_serializer(instance, data=data, partial=partial)
    
    try:
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(resposta_json(sucesso=True, resultado=serializer.data))
    except Exception as exc:
        return context.handle_exception(exc)

def _get_perfil(perfil, pk, nome_entidade):
        try:
            return perfil.objects.get(pk=pk)
        except perfil.DoesNotExist:
            raise Http404(f"{nome_entidade} não encontrado com o ID fornecido.")

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

    # Usando a função genérica para diferentes ações
    @update_participantes_swagger()
    def update(self, request, *args, **kwargs):
        participante = _get_perfil(Participante, kwargs['pk'], "Participante")
        return _handle_serialization(self, participante, data=request.data)

    @list_participantes_swagger()
    def list(self, request, *args, **kwargs):
        participantes = self.get_queryset() 
        serializer = self.get_serializer(participantes, many=True)
        return Response(resposta_json(sucesso=True, resultado=serializer.data))

    @retrieve_participantes_swagger()
    def retrieve(self, request, *args, **kwargs):
        participante = _get_perfil(Participante, kwargs['pk'], "Participante")
        serializer = self.get_serializer(participante)
        return Response(resposta_json(sucesso=True, resultado=serializer.data))

    @partial_update_participantes_swagger()
    def partial_update(self, request, *args, **kwargs):
        participante = _get_perfil(Participante, kwargs['pk'], "Participante")
        return _handle_serialization(self, participante, data=request.data, partial=True)

    @create_participantes_swagger()
    def create(self, request, *args, **kwargs):
        return _handle_serialization(self, None, data=request.data)

    @delete_participantes_swagger()
    def destroy(self, request, *args, **kwargs):
        # Anonimizar o usuario
        participante = _get_perfil(Participante, kwargs['pk'], "Participante")
        participante.usuario.delete()
        participante.delete()
        return Response(resposta_json(sucesso=True, resultado="Participante apagado com sucesso"), status=status.HTTP_204_NO_CONTENT)


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

    @update_techleaders_swagger()
    def update(self, request, *args, **kwargs):
        techleader = _get_perfil(TechLeader, kwargs['pk'], 'Tech Leader')
        return _handle_serialization(self, techleader, data=request.data)

    @list_techleaders_swagger()
    def list(self, request, *args, **kwargs):
        techleaders = self.get_queryset() 
        serializer = self.get_serializer(techleaders, many=True)
        return Response(resposta_json(sucesso=True, resultado=serializer.data))

    @retrieve_techleaders_swagger()
    def retrieve(self, request, *args, **kwargs):
        techleader = _get_perfil(TechLeader, kwargs['pk'], 'Tech Leader')
        serializer = self.get_serializer(techleader)
        return Response(resposta_json(sucesso=True, resultado=serializer.data))

    @partial_update_techleaders_swagger()
    def partial_update(self, request, *args, **kwargs):
        techleader = _get_perfil(TechLeader, kwargs['pk'], 'Tech Leader')
        return _handle_serialization(self, techleader, data=request.data, partial=True)

    @create_techleaders_swagger()
    def create(self, request, *args, **kwargs):
        return _handle_serialization(self, None, data=request.data)

    @delete_techleaders_swagger()
    def destroy(self, request, *args, **kwargs):
        # Anonimizar o usuario        
        techleader = _get_perfil(TechLeader, kwargs['pk'], 'Tech Leader')
        techleader.usuario.delete()
        techleader.delete()
        return Response(resposta_json(sucesso=True, resultado="Tech Leader apagado com sucesso"), status=status.HTTP_204_NO_CONTENT)
    
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
    
    @update_empresas_swagger()
    def update(self, request, *args, **kwargs):
        empresa = _get_perfil(Empresa, kwargs['pk'], 'Empresa')
        return _handle_serialization(self, empresa, data=request.data)

    @list_empresas_swagger()
    def list(self, request, *args, **kwargs):
        
        empresas = self.get_queryset() 
        serializer = self.get_serializer(empresas, many=True)
        return Response(resposta_json(sucesso=True, resultado=serializer.data))

    @retrieve_empresas_swagger()
    def retrieve(self, request, *args, **kwargs):
        empresa = _get_perfil(Empresa, kwargs['pk'], 'Empresa')
        serializer = self.get_serializer(empresa)
        return Response(resposta_json(sucesso=True, resultado=serializer.data))

    @partial_update_empresas_swagger()
    def partial_update(self, request, *args, **kwargs):
        
        empresa = _get_perfil(Empresa, kwargs['pk'], 'Empresa')
        return _handle_serialization(self, empresa, data=request.data, partial=True)

    @create_empresas_swagger()
    def create(self, request, *args, **kwargs):
        return _handle_serialization(self, None, data=request.data)

    @delete_empresas_swagger()
    def destroy(self, request, *args, **kwargs):
        # Anonimizar o usuario
        empresa = self._get_empresa(kwargs['pk'])
        empresa.usuario.delete()
        empresa.delete()
        return Response(resposta_json(sucesso=True, resultado="Empresa apagada com sucesso"), status=status.HTTP_204_NO_CONTENT)
    
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
    
    def update(self, request, *args, **kwargs):
        excecao = _get_perfil(Excecao, kwargs['pk'], 'Participance(exceção)')
        return _handle_serialization(self, excecao, data=request.data)
    
    def list(self, request, *args, **kwargs):
        excecao = self.get_queryset()
        serializer = self.get_serializer(excecao, many=True)
        return Response(resposta_json(sucesso=True, resultado=serializer.data))
    
    def retrieve(self, request, *args, **kwargs):
        excecao = _get_perfil(Excecao, kwargs['pk'], 'Participance(exceção)')
        serializer = self.get_serializer(excecao)
        return Response(resposta_json(sucesso=True, resultado=serializer.data))
    
    def partial_update(self, request, *args, **kwargs):
        excecao = _get_perfil(Excecao, kwargs['pk'], 'Participance(exceção)')
        return _handle_serialization(self, excecao, data=request.data, partial=True)
    
    def create(self, request, *args, **kwargs):
        return _handle_serialization(self, None, data=request.data)
    
    def destroy(self, request, *args, **kwargs):
        # Anonimizar usuario
        excecao = _get_perfil(Excecao, kwargs['pk'], 'Participance(exceção)')
        excecao.usuario.delete()
        excecao.delete()
        return Response(resposta_json(sucesso=True, resultado="Participante(exceção) apagado com sucesso"), status=status.HTTP_204_NO_CONTENT)
    
class ExtensionistaViewSet(ErrorHandlingMixin, viewsets.ModelViewSet):
    queryset = Extensionista.objects.all()
    serializer_class = ExtensionistaSerializer
    
    def get_permissions(self):
        return [permissions.IsAuthenticated, permissions.IsAdminUser]
    
    def get_queryset(self):
        return Extensionista.objects.all()
        
    def update(self, request, *args, **kwargs):
        extensionista = _get_perfil(Extensionista, kwargs['pk'], 'Extensionista')
        return _handle_serialization(self, extensionista, data=request.data)
    
    def list(self, request, *agrs, **kwargs):
        extensionista = self.get_queryset()
        serializer = self.get_serializer(extensionista, many=True)
        return Response(resposta_json(sucesso=True, resultado=serializer.data))
    
    def retrive(self, request, *agrs, **kwargs):
        extensionista = _get_perfil(Extensionista, kwargs['pk'], 'Extensionista')
        serializer = self.get_serializer(extensionista)
        return Response(resposta_json(sucesso=True, resultado=serializer.data))
    
    def partial_update(self, request, *args, **kwargs):
        extensionista = _get_perfil(Extensionista, kwargs['pk'], 'Extensionista')
        serializer = _handle_serialization(self, extensionista, data=request.data, partial=True)
        return Response(resposta_json(sucesso=True, resultado=serializer.data))
    
    def create(self, request, *args, **kwargs):
        return _handle_serialization(self, None, data=request.data)
        
    def destroy(self, request, *args, **kwargs):
        extensionista = _get_perfil(Extensionista, kwargs['pk'], 'Extensionista')
        extensionista.delete()
        return Response(resposta_json(sucesso=True, resultado="Extensionista apagado com sucesso"), status=status.HTTP_204_NO_CONTENT)