from rest_framework import serializers
from api_rest.models import Usuario, Participante, Empresa, TechLeader, Extensionista, Excecao
from django.core.exceptions import ValidationError
from django.db import models, IntegrityError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import hashlib

class AdminCreateSerializer(serializers.Serializer):
    nome = serializers.CharField(max_length=120)
    username = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        try:
            user = Usuario.objects.create_superuser(
                nome=validated_data['nome'],
                username=validated_data['username'],
                password=validated_data['password'],
            )
            return user
        except IntegrityError:
            raise serializers.ValidationError({
                "username": "Já existe um usuário com esse e-mail."
            })

# serializer base do usuario, usado nos perfis
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id','nome', 'username', 'password', 'telefone']
        extra_kwargs = {
            'password': {'write_only': True},  # senha n aparece em leitura
            'username': {'required': True},
            'nome': {'required': True}
        }     
    
    def validate_username(self, value):
        if self.instance:
            if Usuario.objects.filter(username=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("Já existe um usuário com este username")
        else:
            if Usuario.objects.filter(username=value).exists():
                raise serializers.ValidationError("Já existe um usuário com este username")
        return value
    
    def create(self, validated_data):
        # cria user via manager (usa set_password etc)
        try:
            return Usuario.objects.create_user(**validated_data)
        except ValidationError as e:
            raise serializers.ValidationError(e.message_dict) 
    
class BasePerfilSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer()

    class Meta:
        abstract = True  # Não será usada diretamente

    def update(self, instance, validated_data):
        usuario_data = validated_data.pop('usuario', None)
        usuario = instance.usuario

        # Atualiza os campos do usuário
        if usuario_data:
            for attr, value in usuario_data.items():
                if attr == 'password':
                    usuario.set_password(value)
                else:
                    setattr(usuario, attr, value)
            usuario.full_clean()
            usuario.save()

        # Atualiza os campos do perfil
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.full_clean()
        instance.save()

        return instance

# serializer aninhado p/ Participante
class ParticipanteSerializer(BasePerfilSerializer):
    usuario = UsuarioSerializer()  # inclui dados do user embutidos

    class Meta:
        model = Participante
        fields = ['id', 'usuario', 'cpf', 'rgm', 'curso', 'outro_curso', 'periodo', 'email_institucional']

    def validate_cpf(self, value):
        if len(value) != 11:
            raise serializers.ValidationError("CPF deve ter exatamente 11 dígitos")
        
        cpf_hash = hashlib.sha256(value.encode()).hexdigest()
        if self.instance:  # Atualização
            if Participante.objects.filter(cpf_hash=cpf_hash).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("Este CPF já está cadastrado")
        else:  # Criação
            if Participante.objects.filter(cpf_hash=cpf_hash).exists():
                raise serializers.ValidationError("Este CPF já está cadastrado")
        return value
        

    def validate_rgm(self, value):
        if len(value) != 8:
            print("hoooollllleee")
            raise serializers.ValidationError("RGM deve ter exatamente 8 dígitos")
        
        rgm_hash = hashlib.sha256(value.encode()).hexdigest()
        if self.instance:
            if Participante.objects.filter(rgm_hash=rgm_hash).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("Este RGM já está cadastrado")
        else:
            if Participante.objects.filter(rgm_hash=rgm_hash).exists():
                raise serializers.ValidationError("Este RGM já está cadastrado")
        return value

    def validate_email_institucional(self, value):
        email_hash = hashlib.sha256(value.lower().encode()).hexdigest()
        if self.instance:
            if Participante.objects.filter(email_institucional_hash=email_hash).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("Este email institucional já está em uso")
        else:
            if Participante.objects.filter(email_institucional_hash=email_hash).exists():
                raise serializers.ValidationError("Este email institucional já está em uso")
        return value

    
    def create(self, validated_data):
        usuario_data = validated_data.pop('usuario')
        # cria user + perfil de forma encadeada
        try:
            usuario = Usuario.criar_participante(
                nome=usuario_data['nome'],
                email=usuario_data['username'],
                senha=usuario_data['password'],
                telefone=usuario_data.get('telefone'),
                **validated_data
            )
            return usuario.participante  
        except ValidationError as e:
            raise serializers.ValidationError(e.message_dict)


# igual ao participante, porem com campos da Empresa
class EmpresaSerializer(BasePerfilSerializer):
    usuario = UsuarioSerializer()

    class Meta:
        model = Empresa
        fields = ['id', 'usuario', 'cnpj', 'representante']

    def create(self, validated_data):
        try:
            usuario_data = validated_data.pop('usuario')
            print(usuario_data)
            usuario = Usuario.criar_empresa(
                nome=usuario_data['nome'],
                email=usuario_data['username'],
                senha=usuario_data['password'],
                telefone=usuario_data.get('telefone'),
                **validated_data
            )
            return usuario.empresa 
        except ValidationError as e:
            raise serializers.ValidationError(e.message_dict)


# igual aos anteriores, usado p/ techleader
class TechLeaderSerializer(BasePerfilSerializer):
    usuario = UsuarioSerializer()

    class Meta:
        model = TechLeader
        fields = ['id', 'usuario', 'codigo', 'especialidade']
        
    def validate_codigo(self, value):
        
        codigo_hash = hashlib.sha256(value.encode()).hexdigest()
        if self.instance:
            if TechLeader.objects.filter(codigo_hash=codigo_hash).exclude(pk = self.instance.pk).exists():
                raise serializers.ValidationError("Este código já está em uso")
        else:
            if TechLeader.objects.filter(codigo_hash=codigo_hash).exists():
                raise serializers.ValidationError("Este código já está em uso")
        
        return value

    def create(self, validated_data):
        try:
            usuario_data = validated_data.pop('usuario')
            print(usuario_data)
            usuario = Usuario.criar_techleader(
                nome=usuario_data['nome'],
                email=usuario_data['username'],
                senha=usuario_data['password'],
                telefone=usuario_data.get('telefone'),
                **validated_data
            )
            return usuario.techleader
        except ValidationError as e:
            raise serializers.ValidationError(e.message_dict)
        
        
class ExcecaoSerializer(BasePerfilSerializer):
    class Meta:
        model = Excecao
        fields = ['id', 'usuario', 'motivo', 'nota', 'data_inicio']
        
    def create(self, validated_data):
        try:
            usuario_data = validated_data.pop('usuario')
            usuario = Usuario.criar_excecao(
                nome=usuario_data['nome'],
                email=usuario_data['username'],
                senha=usuario_data['password'],
                telefone=usuario_data.get('telefone'),
                **validated_data
            )
            return usuario.excecao
        except ValidationError as e:
            raise serializers.ValidationError(e.message_dict)

class ExtensionistaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Extensionista
        fields = ['id', 'participante', 'excecao']
        
    def validate(self, data):
        participante = data.get('participante')
        excecao = data.get('excecao')
        
        if participante and excecao:
            raise serializers.ValidationError("Preencha apenas 'participante' ou 'excecao', nunca ambos.")
        if not participante and not excecao:
            raise serializers.ValidationError("Um dos campos ('participante' ou 'excecao') deve ser preenchido.")
        return data
        
# serializer customizado do login p/ JWT
class CustomTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # adiciona dados extra no payload do token jwt
        token['nome'] = user.nome
        token['email'] = user.username
        token['tipo_usuario'] = user.get_tipo_usuario()

        return token

