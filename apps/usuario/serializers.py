from rest_framework import serializers
from .models import Usuarios, Experiencias

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = "__all__"
        
class ExperienciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experiencias
        fields = "__all__"