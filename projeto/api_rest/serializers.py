from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from api_rest.models import Usuario, Participante, Empresa, TechLeader, Extensionista, Excecao
from imersao.models import Imersao, Iteracao, FormularioInscricao
from django.core.exceptions import ValidationError
from django.db import models, IntegrityError
from django.db.models import QuerySet
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import hashlib


def resposta_json(sucesso=False, resultado=None, erro='', detalhes=[]):
    return {
        'sucesso': sucesso,
        'resultado': resultado,
        'erro': erro,
        'detalhes': detalhes
    }

def links_acesso():

    pass
    
    
def _get_user_data(validated_data):
    usuario = validated_data.pop('usuario')
    return usuario.pop('nome'), usuario.pop('username'), usuario.pop('password'), usuario.pop('telefone') 
    
    
class AdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'username', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        try:
            return Usuario.objects.create_superuser(
                nome=validated_data['nome'],
                username=validated_data['username'],
                password=validated_data['password']
            )
        except IntegrityError:
            raise serializers.ValidationError("Já existe um usuário com esse e-mail.")

    def update(self, instance, validated_data):
        instance.nome = validated_data.get('nome', instance.nome)
        instance.username = validated_data.get('username', instance.username)
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        instance.save()
        return instance

# serializer base do usuario, usado nos perfis
class UsuarioSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Usuario
        fields = ['id','nome', 'username', 'password', 'telefone']
        extra_kwargs = {
            'password': {'write_only': True},  # senha n aparece em leitura
            'username': {'required': True},
            'nome': {'required': True},
            'telefone': {'required': False},
        }     
    
    def create(self, validated_data):
        # cria user via manager (usa set_password etc)
        try:
            return Usuario.objects.create_user(**validated_data)
        except ValidationError as e:
            raise serializers.ValidationError(e.message_dict) 
    


class BasePerfilSerializer(serializers.ModelSerializer):
    class Meta:
        abstract = True

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if self.instance and not isinstance(self.instance, (list, QuerySet)):
            if hasattr(self.instance, 'usuario') and self.instance.usuario:
                for field, attr in [
                    ('nome', 'nome'),
                    ('username', 'username'),
                    ('telefone', 'telefone'),
                    ('ativado', 'is_active')
                ]:
                    if field in self.fields:
                        self.fields[field].initial = getattr(self.instance.usuario, attr)

    def validate_username(self, value):
        if self.instance:
            if Usuario.objects.filter(username=value).exclude(pk=self.instance.usuario.pk).exists():
                raise serializers.ValidationError("Já existe um usuário com esse email.")
        else:
            if Usuario.objects.filter(username=value).exists():
                raise serializers.ValidationError("Já existe um usuário com esse email.")
            
        return value
    
    def update(self, instance, validated_data):
        usuario_data = validated_data.pop('usuario', {})

        password = usuario_data.pop('password', None)
        if password:
            instance.usuario.set_password(password)
            instance.usuario.save()

        if usuario_data:
            usuario_serializer = UsuarioSerializer(
                instance=instance.usuario,
                data=usuario_data,
                partial=True
            )
            usuario_serializer.is_valid(raise_exception=True)
            usuario_serializer.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.full_clean()
        instance.save()

        return instance


# serializer aninhado p/ Participante
class ParticipanteSerializer(BasePerfilSerializer):
    
    membro = serializers.SerializerMethodField(read_only=True)
    id_usuario = serializers.IntegerField(read_only=True,source='usuario.id')
    nome = serializers.CharField(source='usuario.nome')
    username = serializers.EmailField(source='usuario.username')
    telefone = serializers.CharField(source='usuario.telefone', required=False)
    password = serializers.CharField(write_only=True, min_length=6, source='usuario.password')
    opcoes = serializers.SerializerMethodField()
    
    id = serializers.SerializerMethodField(read_only=True)
    ativado = serializers.BooleanField(
        write_only=True,
        required=False,
        help_text="True para ativar a conta, False para desativar"
    )

    class Meta:
        model = Participante
        fields = ['id','id_usuario', 'nome', 'username', 'telefone', 'password', 'cpf', 'rgm', 'curso', 'outro_curso', 'periodo','opcoes', 'membro', 'ativado']
    
    def get_id(self, participante): return participante.usuario.id
    
    def get_opcoes(self, participante):
        formulario = FormularioInscricao.objects.filter(participante=participante).first()
        
        if formulario:
            return {
                "primeira": getattr(formulario.primeira_opcao, 'nome', None),
                "segunda": getattr(formulario.segunda_opcao, 'nome', None)
            }
        
        return None
    
    def get_membro(self, participante):
        extensao = participante.extensionista_participante.first()
        if extensao:
            return {
                'extensionista': True,
                'veterano': extensao.veterano
            }
        else:
            return {'imersionista': True}

    def validate_cpf(self, value):
        if len(value) != 11:
            raise serializers.ValidationError("CPF deve ter exatamente 11 dígitos")
        cpf_hash = hashlib.sha256(value.encode()).hexdigest()
        if self.instance:  # Atualização
            if Participante.objects.filter(cpf_hash=cpf_hash).exclude(usuario=self.instance.usuario).exists():
                raise serializers.ValidationError("Este CPF já está cadastrado")
        else:  # Criação
            if Participante.objects.filter(cpf_hash=cpf_hash).exists():
                raise serializers.ValidationError("Este CPF já está cadastrado")
        return value

    def validate_rgm(self, value):
        if len(value) != 8:
            raise serializers.ValidationError("RGM deve ter exatamente 8 dígitos")
        rgm_hash = hashlib.sha256(value.encode()).hexdigest()
        if self.instance:
            if Participante.objects.filter(rgm_hash=rgm_hash).exclude(usuario=self.instance.usuario).exists():
                raise serializers.ValidationError("Este RGM já está cadastrado")
        else:
            if Participante.objects.filter(rgm_hash=rgm_hash).exists():
                raise serializers.ValidationError("Este RGM já está cadastrado")
        return value
    
    def create(self, validated_data):

        # cria user + perfil de forma encadeada
        try:
            nome, username, password, telefone = _get_user_data(validated_data)
            usuario = Usuario.criar_participante(
                nome=nome,
                email=username,
                senha=password,
                telefone={telefone or ""},
                **validated_data
            )
            return usuario.participante  
        except ValidationError as e:
            raise serializers.ValidationError(e.message_dict)


# igual ao participante, porem com campos da Empresa
class EmpresaSerializer(BasePerfilSerializer):
    nome = serializers.CharField(source='usuario.nome')
    username = serializers.EmailField(source='usuario.username')
    telefone = serializers.CharField(source='usuario.telefone', required=False)
    password = serializers.CharField(write_only=True, min_length=6, source='usuario.password')
    id = serializers.SerializerMethodField(read_only=True)
    ativado = serializers.BooleanField(
        write_only=True,
        required=False,
        help_text="True para ativar a conta, False para desativar"
    )

    class Meta:
        model = Empresa
        fields = ['id', 'nome', 'username','password', 'telefone', 'cnpj', 'representante', 'ativado']
    
    def get_id(self, participante): return participante.usuario.id
    
    def validate_cnpj(self, value):
        
        if self.instance:
            if Empresa.objects.filter(cnpj=value).exclude(usuario=self.instance.usuario).exists():
                print(Empresa.objects.filter(cnpj=value).exclude(usuario=self.instance.usuario))
                raise serializers.ValidationError("Este CNPJ já está cadastrado")
        else:
            if Empresa.objects.filter(cnpj=value).exists():
                print(Empresa.objects.filter(cnpj=value))
                raise serializers.ValidationError("Este CNPJ já está cadastrado")
        return value
        
    
    def create(self, validated_data):
        print(validated_data)
        try:
            nome, username, password, telefone = _get_user_data(validated_data)
            usuario = Usuario.criar_empresa( nome=nome, email=username, senha=password, telefone=telefone, **validated_data )
            return usuario.empresa 
        except ValidationError as e:
            raise serializers.ValidationError(e.message_dict)


# igual aos anteriores, usado p/ techleader
class TechLeaderSerializer(BasePerfilSerializer):
    nome = serializers.CharField(source='usuario.nome')
    username = serializers.EmailField(source='usuario.username')
    telefone = serializers.CharField(source='usuario.telefone', required=False)
    password = serializers.CharField(write_only=True, min_length=6, source='usuario.password')
    id = serializers.SerializerMethodField(read_only=True)
    ativado = serializers.BooleanField(
        write_only=True,
        required=False,
        help_text="True para ativar a conta, False para desativar"
    )

    class Meta:
        model = TechLeader
        fields = ['id', 'nome', 'username', 'telefone', 'password', 'codigo', 'especialidade', 'ativado']
        
    def get_id(self, participante): return participante.usuario.id
    
    def validate_codigo(self, value):
        
        codigo_hash = hashlib.sha256(value.encode()).hexdigest()
        if self.instance:
            if TechLeader.objects.filter(codigo_hash=codigo_hash).exclude(usuario=self.instance.usuario).exists():
                raise serializers.ValidationError("Este código já está cadastrado")
        else:
            if TechLeader.objects.filter(codigo_hash=codigo_hash).exists():
                raise serializers.ValidationError("Este código já está cadastrado")
        
        return value

    def create(self, validated_data):
        try:
            nome, username, password, telefone = _get_user_data(validated_data)
            usuario = Usuario.criar_techleader(nome=nome, email=username, senha=password, telefone=telefone, **validated_data)
            return usuario.techleader
        except ValidationError as e:
            raise serializers.ValidationError(e.message_dict)
        
        
class ExcecaoSerializer(BasePerfilSerializer):
    
    id = serializers.SerializerMethodField(read_only=True)
    nome = serializers.CharField(source='usuario.nome')
    username = serializers.EmailField(source='usuario.username')
    telefone = serializers.CharField(source='usuario.telefone', required=False)
    password = serializers.CharField(write_only=True, min_length=6, source='usuario.password')
    membro = serializers.SerializerMethodField(read_only=True)
    ativado = serializers.BooleanField(
        write_only=True,
        required=False,
        help_text="True para ativar a conta, False para desativar"
    )
    
    class Meta:
        model = Excecao
        fields = ['id', 'nome', 'username', 'telefone', 'password', 'motivo', 'nota', 'data_inicio', 'membro', 'ativado']
        
    def get_id(self, participante): return participante.usuario.id
        
    def get_membro(self, excecao):
        extensao = excecao.extensionista_excecao.first()
        if extensao:
            return {
                'extensionista': True,
                'veterano': extensao.veterano
            }
        else:
            return {'imersionista': True}
    
        
    def create(self, validated_data):
        try:
            nome, username, password, telefone = _get_user_data(validated_data)
            usuario = Usuario.criar_excecao(nome=nome, email=username, senha=password, telefone=telefone, **validated_data)
            return usuario.excecao
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)


class ExtensionistaBulkSerializer(serializers.Serializer):
    usuarios = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False
    )


class ExtensionistaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Extensionista
        fields = ['id', 'participante', 'excecao', 'veterano']
    
    def validate_participante(self, value):
        
        if self.instance:
            if Extensionista.objects.filter(participante=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("Este participante já está cadastrado como extensionista")
        else:
            if Extensionista.objects.filter(participante=value).exists():
                raise serializers.ValidationError("Este participante já está cadastrado como extensionista")
        return value
    
    def validate_excecao(self, value):
        if self.instance:
            if Extensionista.objects.filter(excecao=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("Este participante já está cadastrado como extensionista")
        else:
            if Extensionista.objects.filter(excecao=value).exists():
                raise serializers.ValidationError("Este participante já está cadastrado como extensionista")
        return value

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
    
    def validate(self, attrs):
        try:
            data = super().validate(attrs)
        except AuthenticationFailed as exc:
            raise serializers.ValidationError(str(exc))

        if not self.user.is_active:
            raise serializers.ValidationError( "Sua conta está inativa. Contate o suporte.")
        
        token = self.get_token(self.user)
        
        data['access'] = str(token.access_token)
        data['refresh'] = str(token)
        
        return resposta_json(sucesso=True, resultado=data)
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['id'] = user.id
        token['nome'] = user.nome
        token['email'] = user.username
        token['tipo_usuario'] = user.get_tipo_usuario()

        return token

