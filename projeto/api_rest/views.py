from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response 
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Usuario, Participante
from .serializers import UsuarioSerializer, ParticipanteSerializer
from django.shortcuts import get_object_or_404
# from .models import Usuarios
# from .serializers import UsuariosSerializer

class UsuarioList(generics.ListAPIView):
   pass

    

class CriarUsuario(generics.CreateAPIView):
   pass
class LoginUsuario(generics.GenericAPIView):
    pass

class EditarUsuario(generics.UpdateAPIView):
   pass

class UsuarioAtual(generics.RetrieveAPIView):
  pass

class AlterarSenha(generics.UpdateAPIView):
   pass

class LogoutUsuario(generics.GenericAPIView):
  pass

class ParticipanteList(viewsets.ModelViewSet):
    """Lista todos os participantes"""
    queryset = Participante.objects.all()
    serializer_class = ParticipanteSerializer
    permission_classes = [permissions.AllowAny]
    

