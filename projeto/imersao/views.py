from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response 
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError


from imersao.models import Imersao
from imersao.serializers import ImersaoSerializer

# Create your views here.

class ImersaoViewSet(viewsets.ModelViewSet):

    queryset = Imersao.objects.all()
    serializer_class = ImersaoSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser] 

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
        if user.is_staff or user.has_perm('api_rest.ver_todas_imersoes'):
            return Imersao.objects.all()
        return Imersao.objects.order_by('-id').first()
