from rest_framework import serializers
from .models import UsuarioModel

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioModel
        fields = ['nome', 'email', 'cpf', 'cargo']
    