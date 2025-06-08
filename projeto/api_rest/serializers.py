from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from api_rest.models import Usuario, Participante, Empresa, TechLeader, Extensionista, Excecao
from imersao.models import Imersao
from django.core.exceptions import ValidationError
from django.db import models, IntegrityError
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
            raise serializers.ValidationError("Já existe um usuário com esse e-mail.")

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

        if hasattr(self, 'instance') and self.instance is not None and self.instance.usuario:
            # Preenche os campos "usuário" a partir do source
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
        # Extrai os dados do subcampo "usuario"
        usuario_data = validated_data.pop('usuario', {})

        password = usuario_data.pop('password', None)
        if password:
            instance.usuario.set_password(password)
            instance.usuario.save()

        # Atualiza os demais campos do usuario, se houver
        if usuario_data:
            usuario_serializer = UsuarioSerializer(
                instance=instance.usuario,
                data=usuario_data,
                partial=True
            )
            usuario_serializer.is_valid(raise_exception=True)
            usuario_serializer.save()

        # Atualiza os campos do próprio modelo (Participante, Empresa, etc.)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.full_clean()
        instance.save()

        return instance


# serializer aninhado p/ Participante
class ParticipanteSerializer(BasePerfilSerializer):
    
    extensionista = serializers.SerializerMethodField(read_only=True)
    imersionista = serializers.SerializerMethodField(read_only=True)
    
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
        model = Participante
        fields = ['id', 'nome', 'username', 'telefone', 'password', 'cpf', 'rgm', 'curso', 'outro_curso', 'periodo', 'extensionista', 'imersionista', 'ativado']
    
    def get_id(self, participante): return participante.usuario.id
    
    def get_extensionista(self, participante):
        extensao = participante.extensionista_participante.first()
        if extensao:
            return {
                'extensionista': True,
                'veterano': extensao.veterano
            }
        return False

    def get_imersionista(self, participante):
        ultima_imersao = Imersao.objects.order_by('-ano', '-semestre').first()
        if not ultima_imersao:
            return False
        participacao = participante.imersoes_participadas.filter(imersao=ultima_imersao).first()
        if participacao:
            return {
                'id_participacao': participacao.id,
                'id_imersao': ultima_imersao.id,
            }
        return False

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
            nome, username, telefone, password = _get_user_data(validated_data)
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
                raise serializers.ValidationError("Este CNPJ já está cadastrado")
        else:
            if Empresa.objects.filter(cnpj=value).exists:
                raise serializers.ValidationError("Este CNPJ já está cadastrado")
        
    
    def create(self, validated_data):
        try:
            nome, username, telefone, password = _get_user_data(validated_data)
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
                raise serializers.ValidationError("Este código já eeestá cadastrado")
        else:
            if TechLeader.objects.filter(codigo_hash=codigo_hash).exists():
                raise serializers.ValidationError("Este código já está cadastrado")
        
        return value

    def create(self, validated_data):
        try:
            nome, username, telefone, password = _get_user_data(validated_data)
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
    extensionista = serializers.SerializerMethodField(read_only=True)
    imersionista = serializers.SerializerMethodField(read_only=True)
    ativado = serializers.BooleanField(
        write_only=True,
        required=False,
        help_text="True para ativar a conta, False para desativar"
    )
    
    class Meta:
        model = Excecao
        fields = ['id', 'nome', 'username', 'telefone', 'password', 'motivo', 'nota', 'data_inicio', 'extensionista', 'imersionista', 'ativado']
        
    def get_id(self, participante): return participante.usuario.id
        
    def get_extensionista(self, excecao):
        extensao = excecao.extensionista_excecao.first()
        if extensao:
            return {
                'extensionista': True,
                'veterano': extensao.veterano
            }
        return False
    
    def get_imersionista(self, excecao):
        ultima_imersao = Imersao.objects.order_by('-ano', '-semestre').first()
        if not ultima_imersao or not ultima_imersao.ativa:
            return False
        
        participacao = excecao.imersoes_participadas.filter(imersao=ultima_imersao).first()
        if participacao and excecao.extensionista_excecao:
            return {
                'id_participacao': participacao.id,
                'id_imersao': ultima_imersao.id,
            }
        
        return False
        
    def create(self, validated_data):
        try:
            nome, username, telefone, password = _get_user_data(validated_data)
            usuario = Usuario.criar_excecao(nome=nome, email=username, senha=password, telefone=telefone, **validated_data)
            return usuario.excecao
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)

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

