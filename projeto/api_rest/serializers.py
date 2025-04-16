from rest_framework import serializers
from api_rest.models import Usuario, Participante, Empresa, TechLeader
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
        fields = ['nome', 'username', 'password']
        extra_kwargs = {
            'password': {
                'write_only': True,  # Nunca mostra em respostas
                'style': {'input_type': 'password'}  # Esconde em inputs
            },
            # Campos somente leitura
            'is_superuser': {'read_only': True},
            'is_staff': {'read_only': True},
            'is_active': {'read_only': True},
            'data_criacao': {'read_only': True},
            'data_atualizacao': {'read_only': True},
            'last_login': {'read_only': True},
        }


    def create(self, validated_data):
        """Cria usuário com senha criptografada"""
        user = Usuario.objects.create_user(
            nome=validated_data['nome'],
            username=validated_data['username'],
            password=validated_data['password'],
        )
        return user
    
class ParticipanteSerializer(serializers.ModelSerializer):
    """Serializer para o modelo Participante"""
    
    usuario = UsuarioSerializer()  # Serializer aninhado para o usuário
    class Meta:
        model = Participante
        fields = ['usuario', 'cpf', 'curso', 'email_institucional']
    #     extra_kwargs = {
    #         'data_criacao': {'read_only': True},
    #         'data_atualizacao': {'read_only': True},     
    #         'email_institucional': {'read_only': True},  # Impede edição do email institucional
    #         'ingresso_fab': {'read_only': True},  # Impede edição do ingresso na fábrica
    #     }

    # def validate_cpf(self, value):  #Implementar validação de CPF por API
    #     """Validação customizada para CPF"""
    #     if len(value) != 11 or not value.isdigit():
    #         raise ValidationError("CPF deve conter exatamente 11 dígitos numéricos.")
        
    #     #Garante que todos cpf's tenha 11 digitos, padroniza o formato sem símbolos e evita dados inválidos
        
        
    #     return value
    
    def create(self, validated_data):
       #Cria um novo participante associado a usuario
        usuario_data = validated_data.pop('usuario')
        usuario = UsuarioSerializer.create(UsuarioSerializer(), validated_data=usuario_data)
        # Cria o usuário associado ao participante

        
        
        participante = Participante.objects.create(usuario=usuario, cpf=validated_data['cpf'], curso=validated_data['curso'], email_institucional=validated_data['email_institucional'])
        
        return participante
    
class EmpresaSerializer(serializers.ModelSerializer):
    """Serializer para o modelo Empresa"""
    
    class Meta:
        model = Empresa
        fields = '__all__'

    def create(self, validated_data):
        """Cria um novo Empresa associado a um Usuario existente"""
        empresa = Empresa.objects.create(**validated_data)
        return empresa
    
class TechLeaderSerializer(serializers.ModelSerializer):
    """Serializer para o modelo TechLeader"""
    
    class Meta:
        model = TechLeader
        fields = '__all__'
   
    def create(self, validated_data):
        """Cria um novo TechLeader associado a um Usuario existente"""
        usuario = validated_data.pop('usuario')
        tech_leader = TechLeader.objects.create(usuario=usuario, **validated_data)
        return tech_leader
        
    