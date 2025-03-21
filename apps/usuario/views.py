from rest_framework.viewsets import ModelViewSet
from .models import Usuarios, Experiencias
from .serializers import UsuarioSerializer, ExperienciaSerializer

class UsuarioViewSet(ModelViewSet):
    queryset = Usuarios.objects.all()
    serializer_class = UsuarioSerializer

class ExperienciaViewSet(ModelViewSet):
    queryset = Experiencias.objects.all()
    serializer_class = ExperienciaSerializer