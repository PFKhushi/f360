from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response 
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError

from rest_framework.views import APIView  
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from .models import Usuario, Participante, TechLeader, Empresa
from .serializers import UsuarioSerializer, ParticipanteSerializer, TechLeaderSerializer, EmpresaSerializer, CustomTokenSerializer
from .permissoes import IsOwnerOrAdmin


# func q atualiza usuario e perfil (participante, empresa, techleader)
# recebe obj perfil, request, e lista de campos do perfil

def atualizar_usuario_e_perfil(instancia_perfil, request, campos_perfil: list):
   data = request.data.copy()
   usuario_data = data.pop('usuario', None)  # separa os dados de usuario

   if usuario_data:
      usuario = instancia_perfil.usuario
      password = usuario_data.pop('password', None)  # extrai a senha se tiver
      for attr, value in usuario_data.items():
         # seta atributos do usuario q mudaram
         if hasattr(usuario, attr) and getattr(usuario, attr) != value:
               setattr(usuario, attr, value)
      if password:
         usuario.set_password(password)  # garante criptografia da senha
      try:
         usuario.save()
      except ValidationError as e:
         return Response({'usuario': e.message_dict}, status=status.HTTP_400_BAD_REQUEST)

   # atualiza campos do perfil
   for attr in campos_perfil:
      if attr in data:
         novo_valor = data[attr]
         if hasattr(instancia_perfil, attr) and getattr(instancia_perfil, attr) != novo_valor:
               setattr(instancia_perfil, attr, novo_valor)

   try:
      instancia_perfil.save()
   except ValidationError as e:
      return Response({'perfil': e.message_dict}, status=status.HTTP_400_BAD_REQUEST)

   return None  # retorno None indica sucesso

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


# view q gerencia CRUD de Participantes
class ParticipanteViewSet(viewsets.ModelViewSet):
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
      return [permissions.AllowAny()] #############retirar depois###############
      # return [perm() for perm in permission_classes]

   def get_queryset(self):
      user = self.request.user
      if user.is_staff or user.has_perm('api_rest.ver_todos_participantes'):
         return Participante.objects.all()
      return Participante.objects.all() #############retirar depois###############
      # return Participante.objects.filter(usuario=user)  # user so ve seu perfil

   def update(self, request, *args, **kwargs):
      participante = self.get_object()
      erro = atualizar_usuario_e_perfil(participante, request, campos_perfil=[
         'cpf', 'rgm', 'curso', 'outro_curso', 'periodo', 'email_institucional'
      ])
      if erro:
         return erro
      serializer = self.get_serializer(participante)
      return Response(serializer.data)

# view p/ techleaders, mesma estrutura da view de participantes
class TechLeaderViewSet(viewsets.ModelViewSet):
   
   serializer_class = TechLeaderSerializer
   
   def get_permissions(self):
      # define regras de acesso p/ cada acao
      if self.action == 'create':
         permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
      elif self.action in ['update', 'partial_update', 'destroy']:
         permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
      else:
         permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
      return [permissions.AllowAny()] #############retirar depois###############
      # return [perm() for perm in permission_classes]

   def get_queryset(self):
      
      user = self.request.user
      if user.is_staff or user.has_perm('api_rest.ver_todos_techleaders'):
         return TechLeader.objects.all()
      return TechLeader.objects.all()#############retirar depois###############
      # return TechLeader.objects.filter(usuario=user)
   
   def update(self, request, *args, **kwargs):
      techleader = self.get_object()
      erro = atualizar_usuario_e_perfil(techleader, request, campos_perfil=[
         'codigo', 'especialidade'
      ])
      if erro:
         return erro
      serializer = self.get_serializer(techleader)
      return Response(serializer.data)
   
# view p/ empresas, logica identica mudando os campos do perfil
class EmpresaViewSet(viewsets.ModelViewSet):
   
   serializer_class = EmpresaSerializer

   def get_permissions(self):
      # define regras de acesso p/ cada acao
      if self.action == 'create':
         permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
      elif self.action in ['update', 'partial_update', 'destroy']:
         permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
      else:
         permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
      return [permissions.AllowAny()] #############retirar depois###############
      # return [perm() for perm in permission_classes]

   def get_queryset(self):
      
      user = self.request.user
      if user.is_staff or user.has_perm('api_rest.ver_todas_empresas'):
         return Empresa.objects.all()
      return Empresa.objects.all()#############retirar depois###############
      # return Empresa.objects.filter(usuario=user)
   
   def update(self, request, *args, **kwargs):
      empresa = self.get_object()
      erro = atualizar_usuario_e_perfil(empresa, request, campos_perfil=[
         'cnpj', 'representante'
      ])
      if erro:
         return erro
      serializer = self.get_serializer(empresa)
      return Response(serializer.data)
   
