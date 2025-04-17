from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response 
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView  
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from .models import Usuario, Participante, TechLeader, Empresa
from .serializers import UsuarioSerializer, ParticipanteSerializer, TechLeaderSerializer, EmpresaSerializer, CustomTokenSerializer
from .permissoes import IsOwnerOrAdmin

# from .models import Usuarios
# from .serializers import UsuariosSerializer

class LoginUsuario(TokenObtainPairView):
   
   serializer_class = CustomTokenSerializer


class LogoutUsuario(APIView):

   def post(self, request):
      
      try:
         refresh_token = request.data.get('refresh_token')
         if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()  # Invalidando o refresh token
            return Response({"detail": "Logout realizado com sucesso!"}, status=status.HTTP_200_OK)
         else:
            return Response({"detail": "Refresh token não fornecido."}, status=status.HTTP_400_BAD_REQUEST)
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
         permission_classes = [permissions.IsAuthenticated]
      return [perm() for perm in permission_classes]

   def get_queryset(self):
      
      user = self.request.user
      if user.is_staff or user.has_perm('api_rest.ver_todos_participantes'):
         return Participante.objects.all()
      return Participante.objects.filter(usuario=user)
   

class TechLeaderViewSet(viewsets.ModelViewSet):
   
   serializer_class = TechLeaderSerializer
   
   def get_permissions(self):
      
      if self.action == 'create':
         return [permissions.AllowAny()]
      elif self.action in ['update', 'partial_update', 'destroy']:
         return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]
      elif self.action == 'list':
         return [permissions.IsAuthenticated()]
      return [permissions.IsAuthenticated()]

   def get_queryset(self):
      
      user = self.request.user
      if user.is_staff or user.has_perm('api_rest.ver_todos_techleaders'):
         return TechLeader.objects.all()
      return TechLeader.objects.filter(usuario=user)
   
class EmpresaViewSet(viewsets.ModelViewSet):
   
   serializer_class = EmpresaSerializer

   def get_permissions(self):
      
      if self.action == 'create':
         return [permissions.AllowAny()]
      elif self.action in ['update', 'partial_update', 'destroy']:
         return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]
      elif self.action == 'list':
         return [permissions.IsAuthenticated()]
      return [permissions.IsAuthenticated()]

   def get_queryset(self):
      
      user = self.request.user
      if user.is_staff or user.has_perm('api_rest.ver_todas_empresas'):
         return Empresa.objects.all()
      return Empresa.objects.filter(usuario=user)
   
