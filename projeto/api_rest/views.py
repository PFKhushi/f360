from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response 
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from rest_framework.views import APIView  
from rest_framework_simplejwt.views import TokenObtainPairView
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import Usuario, Participante, TechLeader, Empresa
from .serializers import UsuarioSerializer, ParticipanteSerializer, TechLeaderSerializer, EmpresaSerializer, CustomTokenSerializer
from .permissoes import IsOwnerOrAdmin

def atualizar_usuario_e_perfil(instancia_perfil, request, campos_perfil: list):
    data = request.data.copy()
    usuario_data = data.pop('usuario', None)

    if usuario_data:
        usuario = instancia_perfil.usuario
        password = usuario_data.pop('password', None)
        for attr, value in usuario_data.items():
            if hasattr(usuario, attr) and getattr(usuario, attr) != value:
                setattr(usuario, attr, value)
        if password:
            usuario.set_password(password)
        try:
            usuario.save()
        except ValidationError as e:
            return Response({'usuario': e.message_dict}, status=status.HTTP_400_BAD_REQUEST)

    for attr in campos_perfil:
        if attr in data:
            novo_valor = data[attr]
            if hasattr(instancia_perfil, attr) and getattr(instancia_perfil, attr) != novo_valor:
                setattr(instancia_perfil, attr, novo_valor)

    try:
        instancia_perfil.save()
    except ValidationError as e:
        return Response({'perfil': e.message_dict}, status=status.HTTP_400_BAD_REQUEST)

    return None

class LoginUsuario(TokenObtainPairView):
    serializer_class = CustomTokenSerializer

    @swagger_auto_schema(
        operation_description="Autenticação de usuário e obtenção de tokens JWT",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['username', 'password'],
            properties={
                'username': openapi.Schema(
                    type=openapi.TYPE_STRING, 
                    format=openapi.FORMAT_EMAIL,
                    description='Email do usuário'
                ),
                'password': openapi.Schema(
                    type=openapi.TYPE_STRING, 
                    description='Senha do usuário'
                ),
            },
        ),
        responses={
            200: openapi.Response(
                description="Autenticação bem-sucedida",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'refresh': openapi.Schema(type=openapi.TYPE_STRING),
                        'access': openapi.Schema(type=openapi.TYPE_STRING),
                        'nome': openapi.Schema(type=openapi.TYPE_STRING),
                        'email': openapi.Schema(type=openapi.TYPE_STRING),
                        'tipo_usuario': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                )
            ),
            400: "Credenciais inválidas",
            401: "Não autorizado"
        },
        tags=['Autenticação']
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

class LogoutUsuario(APIView):
    @swagger_auto_schema(
        operation_description="Realiza logout invalidadando o token de refresh",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['refresh_token'],
            properties={
                'refresh_token': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description='Token de refresh a ser invalidado'
                )
            },
        ),
        responses={
            200: openapi.Response(
                description="Logout realizado com sucesso",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'detail': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            example="Logout realizado com sucesso!"
                        )
                    }
                )
            ),
            400: "Token inválido ou não fornecido",
            401: "Não autenticado"
        },
        security=[{'Bearer': []}],
        tags=['Autenticação']
    )
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({"detail": "Logout realizado com sucesso!"}, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Refresh token nao fornecido."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": "Erro ao fazer logout"}, status=status.HTTP_400_BAD_REQUEST)

class ParticipanteViewSet(viewsets.ModelViewSet):
    queryset = Participante.objects.all()
    serializer_class = ParticipanteSerializer

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        return [permissions.AllowAny()]  # TODO: Retirar depois

    @swagger_auto_schema(
        operation_description="Lista todos os participantes",
        manual_parameters=[
            openapi.Parameter(
                'curso',
                openapi.IN_QUERY,
                description="Filtrar por curso",
                type=openapi.TYPE_STRING,
                enum=['ADS', 'CC', 'SI', 'CD', 'OTR']
            )
        ],
        responses={
            200: ParticipanteSerializer(many=True),
            401: "Não autenticado",
            403: "Sem permissão"
        },
        tags=['Participantes']
    )
    def list(self, request, *args, **kwargs):
        user = self.request.user
        if user.is_staff or user.has_perm('api_rest.ver_todos_participantes'):
            return super().list(request, *args, **kwargs)
        return super().list(request, *args, **kwargs)  # TODO: Modificar depois

    @swagger_auto_schema(
        operation_description="Cria um novo participante",
        request_body=ParticipanteSerializer,
        responses={
            201: ParticipanteSerializer(),
            400: "Dados inválidos",
            401: "Não autenticado"
        },
        tags=['Participantes']
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retorna detalhes de um participante",
        responses={
            200: ParticipanteSerializer(),
            401: "Não autenticado",
            403: "Sem permissão",
            404: "Não encontrado"
        },
        tags=['Participantes']
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Atualiza todos os campos de um participante",
        request_body=ParticipanteSerializer,
        responses={
            200: ParticipanteSerializer(),
            400: "Dados inválidos",
            401: "Não autenticado",
            403: "Sem permissão",
            404: "Não encontrado"
        },
        security=[{'Bearer': []}],
        tags=['Participantes']
    )
    def update(self, request, *args, **kwargs):
        participante = self.get_object()
        erro = atualizar_usuario_e_perfil(participante, request, campos_perfil=[
            'cpf', 'rgm', 'curso', 'outro_curso', 'periodo', 'email_institucional'
        ])
        if erro:
            return erro
        serializer = self.get_serializer(participante)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Atualiza campos específicos de um participante",
        request_body=ParticipanteSerializer,
        responses={
            200: ParticipanteSerializer(),
            400: "Dados inválidos",
            401: "Não autenticado",
            403: "Sem permissão",
            404: "Não encontrado"
        },
        security=[{'Bearer': []}],
        tags=['Participantes']
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Remove um participante",
        responses={
            204: "Participante removido com sucesso",
            401: "Não autenticado",
            403: "Sem permissão",
            404: "Não encontrado"
        },
        security=[{'Bearer': []}],
        tags=['Participantes']
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

class TechLeaderViewSet(viewsets.ModelViewSet):
    serializer_class = TechLeaderSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        return [permissions.AllowAny()]  # TODO: Retirar depois

    @swagger_auto_schema(
        operation_description="Lista todos os tech leaders",
        responses={
            200: TechLeaderSerializer(many=True),
            401: "Não autenticado",
            403: "Sem permissão"
        },
        tags=['Tech Leaders']
    )
    def list(self, request, *args, **kwargs):
        user = self.request.user
        if user.is_staff or user.has_perm('api_rest.ver_todos_techleaders'):
            return super().list(request, *args, **kwargs)
        return super().list(request, *args, **kwargs)  # TODO: Modificar depois

    @swagger_auto_schema(
        operation_description="Cria um novo tech leader (apenas admin)",
        request_body=TechLeaderSerializer,
        responses={
            201: TechLeaderSerializer(),
            400: "Dados inválidos",
            401: "Não autenticado",
            403: "Sem permissão"
        },
        security=[{'Bearer': []}],
        tags=['Tech Leaders']
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retorna detalhes de um tech leader",
        responses={
            200: TechLeaderSerializer(),
            401: "Não autenticado",
            403: "Sem permissão",
            404: "Não encontrado"
        },
        tags=['Tech Leaders']
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Atualiza todos os campos de um tech leader",
        request_body=TechLeaderSerializer,
        responses={
            200: TechLeaderSerializer(),
            400: "Dados inválidos",
            401: "Não autenticado",
            403: "Sem permissão",
            404: "Não encontrado"
        },
        security=[{'Bearer': []}],
        tags=['Tech Leaders']
    )
    def update(self, request, *args, **kwargs):
        techleader = self.get_object()
        erro = atualizar_usuario_e_perfil(techleader, request, campos_perfil=[
            'codigo', 'especialidade'
        ])
        if erro:
            return erro
        serializer = self.get_serializer(techleader)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Atualiza campos específicos de um tech leader",
        request_body=TechLeaderSerializer,
        responses={
            200: TechLeaderSerializer(),
            400: "Dados inválidos",
            401: "Não autenticado",
            403: "Sem permissão",
            404: "Não encontrado"
        },
        security=[{'Bearer': []}],
        tags=['Tech Leaders']
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Remove um tech leader",
        responses={
            204: "Tech leader removido com sucesso",
            401: "Não autenticado",
            403: "Sem permissão",
            404: "Não encontrado"
        },
        security=[{'Bearer': []}],
        tags=['Tech Leaders']
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

class EmpresaViewSet(viewsets.ModelViewSet):
    serializer_class = EmpresaSerializer

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
        return [permissions.AllowAny()]  # TODO: Retirar depois

    @swagger_auto_schema(
        operation_description="Lista todas as empresas",
        responses={
            200: EmpresaSerializer(many=True),
            401: "Não autenticado",
            403: "Sem permissão"
        },
        tags=['Empresas']
    )
    def list(self, request, *args, **kwargs):
        user = self.request.user
        if user.is_staff or user.has_perm('api_rest.ver_todas_empresas'):
            return super().list(request, *args, **kwargs)
        return super().list(request, *args, **kwargs)  # TODO: Modificar depois

    @swagger_auto_schema(
        operation_description="Cria uma nova empresa (apenas admin)",
        request_body=EmpresaSerializer,
        responses={
            201: EmpresaSerializer(),
            400: "Dados inválidos",
            401: "Não autenticado",
            403: "Sem permissão"
        },
        security=[{'Bearer': []}],
        tags=['Empresas']
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retorna detalhes de uma empresa",
        responses={
            200: EmpresaSerializer(),
            401: "Não autenticado",
            403: "Sem permissão",
            404: "Não encontrado"
        },
        tags=['Empresas']
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Atualiza todos os campos de uma empresa",
        request_body=EmpresaSerializer,
        responses={
            200: EmpresaSerializer(),
            400: "Dados inválidos",
            401: "Não autenticado",
            403: "Sem permissão",
            404: "Não encontrado"
        },
        security=[{'Bearer': []}],
        tags=['Empresas']
    )
    def update(self, request, *args, **kwargs):
        empresa = self.get_object()
        erro = atualizar_usuario_e_perfil(empresa, request, campos_perfil=[
            'cnpj', 'representante'
        ])
        if erro:
            return erro
        serializer = self.get_serializer(empresa)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Atualiza campos específicos de uma empresa",
        request_body=EmpresaSerializer,
        responses={
            200: EmpresaSerializer(),
            400: "Dados inválidos",
            401: "Não autenticado",
            403: "Sem permissão",
            404: "Não encontrado"
        },
        security=[{'Bearer': []}],
        tags=['Empresas']
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Remove uma empresa",
        responses={
            204: "Empresa removida com sucesso",
            401: "Não autenticado",
            403: "Sem permissão",
            404: "Não encontrado"
        },
        security=[{'Bearer': []}],
        tags=['Empresas']
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)