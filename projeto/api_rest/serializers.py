from rest_framework import serializers
from api_rest.models import Usuario
from django.core.exceptions import ValidationError
# from .models import Usuarios
# class UsuariosSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Usuarios
#         fields = "__all__"
        
#     def create(self, validated_data):
#         password = validated_data.pop('password')
#         user = Usuarios(**validated_data)
#         user.set_password(password)
#         user.save()
#         return user
        

class UsuarioSerializer(serializers.ModelSerializer):
    """Serializer para o modelo Usuario com validações customizadas"""
    
    class Meta:
        model = Usuario
        fields = "__all__"
        extra_kwargs = {
            'password': {
                'write_only': True,  # Nunca mostra em respostas
                'style': {'input_type': 'password'}  # Esconde em inputs
            },
            # Campos somente leitura
            'projetos_entregues': {'read_only': True},
            'last_login': {'read_only': True},
            'is_superuser': {'read_only': True},
            'is_staff': {'read_only': True},
            'is_active': {'read_only': True},
            'date_joined': {'read_only': True},
            'groups': {'read_only': True},
            'user_permissions': {'read_only': True}
        }

    def validate_cpf(self, value):
        """Validação customizada para CPF"""
        if len(value) != 11 or not value.isdigit():
            raise ValidationError("CPF deve conter exatamente 11 dígitos numéricos.")
        
        #Garante que todos cpf's tenha 11 digitos, padroniza o formato sem símbolos e evita dados inválidos
        
        
        return value

    def validate_termos_aceitos(self, value):
        """
        Garante que todos os termos foram aceitos, caso contrário, bloqueia o cadastro até aceitar os termos
        
        """
        if not value:
            raise ValidationError("Você deve aceitar os termos de uso para se registrar.")
        return value

    def create(self, validated_data):
        """Cria usuário com senha criptografada"""
        user = Usuario.objects.create_user(
            nome=validated_data['nome'],
            cpf=validated_data['cpf'],
            username=validated_data['username'],
            email_institucional=validated_data['email_institucional'],
            rgm=validated_data['rgm'],
            password=validated_data['password'],
            termos_aceitos=validated_data['termos_aceitos']
        )
        return user