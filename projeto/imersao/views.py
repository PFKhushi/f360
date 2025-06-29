from rest_framework import generics, permissions, status, viewsets, serializers
from rest_framework.response import Response 
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import NotFound, APIException, PermissionDenied, NotAuthenticated

from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import Http404


from api_rest.models import Participante
from imersao.models import Iteracao, Imersao, AreaFabrica, Tecnologia, InteresseArea, FormularioInscricao, Palestra, DiaWorkshop, Workshop, ParticipacaoImersao, PresencaPalestra, PresencaWorkshop, DesempenhoWorkshop, InstrutorWorkshop
from imersao.serializers import (IteracaoSerializer, ImersaoSerializer, AreaFabricaSerializer, 
TecnologiaSerializer, InteresseAreaSerializer, FormularioInscricaoListSerializer,
FormularioInscricaoDetailSerializer, FormularioInscricaoCreateUpdateSerializer, 
PalestraSerializer, DiaWorkshopSerializer, WorkshopListSerializer, WorkshopDetailSerializer, WorkshopCreateUpdateSerializer, InstrutorWorkshopSerializer,
ParticipacaoImersaoSerializer, PresencaPalestraSerializer, PresencaWorkshopSerializer, PresencaWorkshopDetailSerializer, PresencaWorkshopListSerializer,
DesempenhoWorkshopSerializer, FormularioInscricaoPorImersaoSerializer, ParticipanteDesempenhoSerializer,
EstatisticasImersaoSerializer)

import logging

logger = logging.getLogger(__name__)

def resposta_json(sucesso=False, resultado=None, erro='', detalhes=[]):
    return {
        'sucesso': sucesso,
        'resultado': resultado,
        'erro': erro,
        'detalhes': detalhes
    }

class ErrorHandlingMixin():
    
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
            print('\n\nValidationError\n\n')
            return self._handle_validation_error(exc)
        elif isinstance(exc, ValidationError):  
            print('\n\nValidationError\n\n')
            return self._handle_django_validation_error(exc)
        elif isinstance(exc, IntegrityError):
            print('\n\nIntegrityError\n\n')
            return self._handle_integrity_error(exc)
        elif isinstance(exc, PermissionDenied):
            print('\n\nPermissionDenied\n\n')
            return self._handle_permission_error(exc)
        elif isinstance(exc, (Http404, NotFound)):
            print('\n\nNotFound\n\n')
            return self._handle_not_found_error(exc)  
        elif isinstance(exc, NotAuthenticated):
            print('\n\nNotAuthenticated\n\n')
            return self._handle_authentication_error(exc)
        elif isinstance(exc, APIException):
            print('\n\nAPIException\n\n')
            return self._handle_api_exception(exc)
        else:
            print('\n\nelse\n\n')
            return self._handle_unexpected_error(exc)
        
    def _flatten_error_messages(self, detail):
        if isinstance(detail, dict):
            messages = []
            for field_name, field_errors in detail.items():
                if isinstance(field_errors, list):
                    for error in field_errors:
                        if hasattr(error, 'string'): 
                            messages.append((field_name + ': ' + str(error)))
                        else:
                            messages.append((field_name + ': ' + str(error)))
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
        return Response(
            resposta_json(
                erro="Erro de validação nos dados enviados", 
                detalhes=self._flatten_error_messages(exc.detail)),
            status=status.HTTP_400_BAD_REQUEST
        )

    def _handle_django_validation_error(self, exc):
        return Response(
            resposta_json(
                erro="Erro de validação", 
                detalhes=self._flatten_error_messages(exc.message_dict) if hasattr(exc, 'message_dict') else self._flatten_error_messages(str(exc))),
            status=status.HTTP_400_BAD_REQUEST
        )
        
    def _handle_not_found_error(self, exc):
        return Response(
            resposta_json(
                erro='Recurso não encontrado', 
                detalhes=self._flatten_error_messages(str(exc))),
            status=status.HTTP_404_NOT_FOUND
        )

    def _handle_integrity_error(self, exc):
        return Response(
            resposta_json(
                erro="Violação de integridade de dados", 
                detalhes=str(exc)),
            status=status.HTTP_409_CONFLICT
        )

    def _handle_permission_error(self, exc):
        return Response(
            resposta_json(
                erro="Não autorizado", 
                detalhes=self._flatten_error_messages(str(exc)) or "Você não tem permissão para acessar este recurso."),
            status=status.HTTP_403_FORBIDDEN
        )

    def _handle_api_exception(self, exc):
        return Response(
            resposta_json(
                erro=exc.default_detail, 
                detalhes=exc.get_full_details()),
            status=exc.status_code
        )

    def _handle_unexpected_error(self, exc):
        request_id = self.request.META.get('X-Request-ID', 'unknown')
        return Response(
            resposta_json(
                erro="Erro inesperado no servidor", 
                detalhes= str(exc)),
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

def _handle_serialization(context, instance, data=None, partial=False):
    
    serializer = context.get_serializer(instance, data=data, partial=partial)
    print(f"\n\ninstance: {instance}\ndata: {data}\n\n")
    try:
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        try:
            result = serializer.data  # Isso pode disparar erro
        except Exception as e:
            print(">>> ERRO AO SERIALIZAR DADOS:", e)
            raise

        print(">>> SALVO COM SUCESSO:", instance)
        return Response(resposta_json(sucesso=True, resultado=result))
    except Exception as exc:
        print(">>> EXCEÇÃO GERAL:", exc)
        return context.handle_exception(exc)

def _get_entidade(entidade, pk, nome_entidade):
        try:
            return entidade.objects.get(pk=pk)
        except entidade.DoesNotExist:
            raise Http404(f"{nome_entidade} não encontrado com o ID fornecido.")

class BaseEntidadeViewSet(viewsets.ModelViewSet):
    entidade = None
    nome_entidade = None
    permission_classes = [permissions.AllowAny] 

    def create(self, request, *args, **kwargs):
        return _handle_serialization(self, None, data=request.data)

    def retrieve(self, request, *args, **kwargs):
        objeto = _get_entidade(self.entidade, kwargs['pk'], self.nome_entidade)
        serializer = self.get_serializer(objeto)
        return Response(resposta_json(sucesso=True, resultado=serializer.data))

    def list(self, request, *args, **kwargs):
        objetos = self.get_queryset()
        serializer = self.get_serializer(objetos, many=True)
        return Response(resposta_json(sucesso=True, resultado=serializer.data))

    def update(self, request, *args, **kwargs):
        objeto = _get_entidade(self.entidade, kwargs['pk'], self.nome_entidade)
        return _handle_serialization(self, objeto, data=request.data)

    def partial_update(self, request, *args, **kwargs):
        objeto = _get_entidade(self.entidade, kwargs['pk'], self.nome_entidade)
        
        
        return _handle_serialization(self, objeto, data=request.data, partial=True)

    def destroy(self, request, *args, **kwargs):
        objeto = _get_entidade(self.entidade, kwargs['pk'], self.nome_entidade)
        objeto.delete()
        return Response(resposta_json(sucesso=True, resultado=f'{self.nome_entidade} apagada com sucesso'), status=status.HTTP_204_NO_CONTENT)

class iteracaoViewSet(ErrorHandlingMixin, BaseEntidadeViewSet, viewsets.ModelViewSet):
    queryset = Iteracao.objects.all()
    serializer_class = IteracaoSerializer
    entidade = Iteracao
    nome_entidade = "Iteracao"
    
    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [perm() for perm in permission_classes]
        return [permissions.AllowAny()] #############retirar depois###############


# Create your views here.
class ImersaoViewSet(ErrorHandlingMixin, BaseEntidadeViewSet, viewsets.ModelViewSet):

    queryset = Imersao.objects.all()
    serializer_class = ImersaoSerializer
    entidade = Imersao
    nome_entidade = 'Imersao'
    
    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [perm() for perm in permission_classes]
        return [permissions.AllowAny()] #############retirar depois###############
    
    
class AreaFabricaViewSet(ErrorHandlingMixin, BaseEntidadeViewSet, viewsets.ModelViewSet):

    queryset = AreaFabrica.objects.all()
    serializer_class = AreaFabricaSerializer
    entidade = AreaFabrica
    nome_entidade = 'AreaFabrica'
    
    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [perm() for perm in permission_classes]
        return [permissions.AllowAny()] #############retirar depois###############
    
    
class TecnologiaViewSet(ErrorHandlingMixin, BaseEntidadeViewSet, viewsets.ModelViewSet):

    queryset = Tecnologia.objects.all()
    serializer_class = TecnologiaSerializer
    entidade = Tecnologia
    nome_entidade = 'Tecnologia'
    
    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [perm() for perm in permission_classes]
        return [permissions.AllowAny()] #############retirar depois###############

    
    
class PalestraViewSet(ErrorHandlingMixin, BaseEntidadeViewSet, viewsets.ModelViewSet):

    queryset = Palestra.objects.all()
    serializer_class = PalestraSerializer
    entidade = Palestra
    nome_entidade = 'Palestra'
    
    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [perm() for perm in permission_classes]
        return [permissions.AllowAny()] #############retirar depois###############


class FormularioInscricaoViewSet(ErrorHandlingMixin, BaseEntidadeViewSet, viewsets.ModelViewSet):

    queryset = FormularioInscricao.objects.all()
    entidade = FormularioInscricao
    nome_entidade = 'FormularioInscricao'

    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        return [perm() for perm in permission_classes]
        return [permissions.AllowAny()] #############retirar depois###############

    def get_queryset(self):
        user = self.request.user

        if user.is_staff or user.has_perm('imersao.ver_todas_inscricoes'):
            return FormularioInscricao.objects.all()
        
        try:
            participante = Participante.objects.get(usuario=user)
            return FormularioInscricao.objects.filter(participante=participante)
        except Participante.DoesNotExist:
            return FormularioInscricao.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return FormularioInscricaoListSerializer
        elif self.action == 'retrieve':
            return FormularioInscricaoDetailSerializer
        else:  # create, update, partial_update, destroy
            return FormularioInscricaoCreateUpdateSerializer
        
    def perform_create(self, serializer):
        print("Usuário autenticado:", self.request.user)
        serializer.save()

class InteresseAreaViewSet(ErrorHandlingMixin, BaseEntidadeViewSet, viewsets.ModelViewSet):

    queryset = InteresseArea.objects.all()
    entidade = InteresseArea
    nome_entidade = 'InteresseArea'
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
        
    
class PresencaPalestraViewSet(ErrorHandlingMixin, BaseEntidadeViewSet, viewsets.ModelViewSet):

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
    
class ParticipacaoImersaoViewSet(ErrorHandlingMixin, BaseEntidadeViewSet, viewsets.ModelViewSet):

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
        
        
class DiaWorkshopViewSet(ErrorHandlingMixin, BaseEntidadeViewSet, viewsets.ModelViewSet):
    
    queryset = DiaWorkshop.objects.all()
    entidade = DiaWorkshop
    nome_entidade = 'DiaWorkshop'
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

class PresencaWorkshopViewSet(ErrorHandlingMixin, BaseEntidadeViewSet, viewsets.ModelViewSet):
    
    queryset = PresencaWorkshop.objects.all()
    entidade = PresencaWorkshop
    nome_entidade = 'PresencaWorkshop'
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
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PresencaWorkshopListSerializer
        elif self.action == 'retrieve':
            return PresencaWorkshopDetailSerializer
        else:  # create, update, partial_update, destroy
            return PresencaWorkshopSerializer
        
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('imersao.ver_presencas_workshop'):
            return PresencaWorkshop.objects.all()
        return PresencaWorkshop.objects.none()
        # return ParticipacaoImersao.objects.all()
    
class DesempenhoWorkshopViewSet(ErrorHandlingMixin, BaseEntidadeViewSet, viewsets.ModelViewSet):
    
    queryset = DesempenhoWorkshop.objects.all()
    entidade = DesempenhoWorkshop
    nome_entidade = 'DesempenhoWorkshop'
    serializer_class = DesempenhoWorkshopSerializer
    
    def get_permissions(self):
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [perm() for perm in permission_classes]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('imersao.ver_desempenhos_workshop'):
            return DesempenhoWorkshop.objects.all()
        return DesempenhoWorkshop.objects.all()
        return DesempenhoWorkshop.objects.none()
    
class WorkshopViewSet(ErrorHandlingMixin, BaseEntidadeViewSet, viewsets.ModelViewSet):

    queryset = Workshop.objects.all()
    entidade = Workshop
    nome_entidade = 'Workshop'
    
    def get_permissions(self):
        # return [permissions.AllowAny()]
        # define regras de acesso p/ cada acao
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [perm() for perm in permission_classes]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.has_perm('imersao.ver_workshops'):
            return Workshop.objects.all()
        
        # if user.participante:
        # elif user.excecao:
        return Workshop.objects.all()
        return Workshop.objects.filter()
        return Workshop.objects.none()
        # modificar retornor para saber se instrutor ou participante/excecao do workshop
        
    def get_serializer_class(self):
        if self.action == 'list':
            return WorkshopListSerializer
        elif self.action == 'retrieve':
            return WorkshopDetailSerializer
        else:  # create, update, partial_update, destroy
            return WorkshopCreateUpdateSerializer
        
    def perform_create(self, serializer):
        print("Usuário autenticado:", self.request.user)
        serializer.save()
        
    
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