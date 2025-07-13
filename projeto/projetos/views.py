from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.exceptions import (
    PermissionDenied, NotFound, NotAuthenticated, APIException
)

from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import Http404
from rest_framework import serializers

from .models import Projeto
from .serializers import ProjetoSerializer, ProjetoBasicSerializer, ProjetoListSerializer 
from .permissions import PodeAlterarProjeto

import logging

logger = logging.getLogger(__name__)


def resposta_json(sucesso=False, resultado=None, erro='', detalhes=[]):
    return {
        'sucesso': sucesso,
        'resultado': resultado,
        'erro': erro,
        'detalhes': detalhes
    }

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
            detalhes=self._flatten_error_messages(str(exc))),
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
                detalhes=[str(exc)]),
            status=status.HTTP_409_CONFLICT
        )

    def _handle_permission_error(self, exc):
        return Response(
            resposta_json(
                erro="Não autorizado", 
                detalhes=self._flatten_error_messages(str(exc)) or ["Você não tem permissão para acessar este recurso."]),
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
        return Response(
            resposta_json(
                erro="Erro inesperado no servidor", 
                detalhes=[str(exc)]),
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    

class ProjetoViewSet(ErrorHandlingMixin, viewsets.ModelViewSet):

    queryset = Projeto.objects.all()

    def get_permissions(self):
        if self.action in ['update', 'partial_update']:
            permission_classes = [permissions.IsAuthenticated, PodeAlterarProjeto]
        elif self.action in ['create', 'destroy']:
            permission_classes = [permissions.IsAdminUser]
        else: 
            permission_classes = [permissions.IsAuthenticated]
        
        return [perm() for perm in permission_classes]

    def get_queryset(self):

        user = self.request.user

        if user.is_staff:
            return Projeto.objects.all().select_related('techleader__usuario', 'empresa__usuario')

        techleader_projetos = Projeto.objects.filter(techleader=getattr(user, 'techleader', None))
        empresa_projetos = Projeto.objects.filter(empresa=getattr(user, 'empresa', None))
        
        membro_projetos = Projeto.objects.none()
        extensionista = None
        if hasattr(user, 'participante'):
            extensionista = user.participante.extensionista_participante.first()
        elif hasattr(user, 'excecao'):
            extensionista = user.excecao.extensionista_excecao.first()
        
        if extensionista:
            membro_projetos = Projeto.objects.filter(equipe=extensionista)

        return (techleader_projetos | empresa_projetos | membro_projetos).distinct().select_related('techleader__usuario', 'empresa__usuario')

    def get_serializer_class(self):

        if self.action == 'list':
            return ProjetoListSerializer

        if self.action == 'retrieve':
            projeto = self.get_object()
            user = self.request.user
            
            if user.is_staff or \
                (hasattr(user, 'techleader') and projeto.techleader == user.techleader) or \
                (hasattr(user, 'empresa') and projeto.empresa == user.empresa):
                return ProjetoSerializer 
            else:
                return ProjetoSerializer
        
        return ProjetoSerializer
    
    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer) 
            
            headers = self.get_success_headers(serializer.data)
            
            return Response(
                resposta_json(sucesso=True, resultado=serializer.data), 
                status=status.HTTP_201_CREATED, 
                headers=headers
            )
        except Exception as e:
            return self.handle_exception(e)


    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(resposta_json(sucesso=True, resultado=serializer.data))

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(resposta_json(sucesso=True, resultado=serializer.data))
        except Exception as e:
            return self.handle_exception(e)
    
    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            
            detail_serializer = self.get_serializer_class()
            final_data = detail_serializer(instance, context={'request': request}).data
            
            return Response(resposta_json(sucesso=True, resultado=final_data))
        except Exception as e:
            return self.handle_exception(e)