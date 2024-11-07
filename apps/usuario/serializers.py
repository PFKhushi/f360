from rest_framework import serializers
from .models import Usuarios, Experiencias

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = [
            "nome",
            "cpf", 
            "username",
            "rgm", 
            "curso",
            "telefone",
            "ingresso_fab",
            "setor",
            "data_criacao",
            "data_atualizacao"
        ]

class ExperienciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experiencias
        fields = "__all__"