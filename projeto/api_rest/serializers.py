from rest_framework import serializers
from api_rest.models import Usuario, Participante, Empresa, TechLeader
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UsuarioSerializer(serializers.ModelSerializer):

    class Meta:
        model = Usuario
        fields = ['id','nome', 'username', 'password', 'telefone']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': True},
            'nome': {'required': True}
        }

    def create(self, validated_data):
        return Usuario.objects.create_user(**validated_data)
    

class UpdateUsuarioNestedMixin:
    def update(self, instance, validated_data):
        usuario_data = validated_data.pop('usuario', None)
        if usuario_data:
            usuario_serializer = UsuarioSerializer(
                instance=instance.usuario,
                data=usuario_data,
                partial=True,
                context=self.context
            )
            usuario_serializer.is_valid(raise_exception=True)
            usuario_serializer.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
class ParticipanteSerializer(UpdateUsuarioNestedMixin, serializers.ModelSerializer):
    usuario = UsuarioSerializer()

    class Meta:
        model = Participante
        fields = ['usuario', 'cpf', 'curso', 'email_institucional']

    def create(self, validated_data):
        usuario_data = validated_data.pop('usuario')
        usuario =Usuario.criar_participante(
            nome=usuario_data['nome'],
            email=usuario_data['username'],
            senha=usuario_data['password'],
            telefone=usuario_data.get('telefone'),
            **validated_data
        )
        return usuario.participante      
    

class EmpresaSerializer(UpdateUsuarioNestedMixin, serializers.ModelSerializer):
    usuario = UsuarioSerializer()

    class Meta:
        model = Empresa
        fields = ['usuario', 'cnpj', 'representante']

    def create(self, validated_data):
        usuario_data = validated_data.pop('usuario')
        usuario = Usuario.criar_empresa(
            nome=usuario_data['nome'],
            email=usuario_data['username'],
            senha=usuario_data['password'],
            telefone=usuario_data.get('telefone'),
            **validated_data
        )
        return usuario.empresa  


class TechLeaderSerializer(UpdateUsuarioNestedMixin, serializers.ModelSerializer):
    usuario = UsuarioSerializer()

    class Meta:
        model = TechLeader
        fields = ['usuario', 'codigo', 'especialidade']

    def create(self, validated_data):
        usuario_data = validated_data.pop('usuario')
        usuario = Usuario.criar_techleader(
            nome=usuario_data['nome'],
            email=usuario_data['username'],
            senha=usuario_data['password'],
            telefone=usuario_data.get('telefone'),
            **validated_data
        )
        return usuario.techleader  
        
        
class CustomTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Adiciona informações customizadas ao payload do token

        token['nome'] = user.nome
        token['email'] = user.username
        token['tipo_usuario'] = user.get_tipo_usuario()

        return token

