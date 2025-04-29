from rest_framework import serializers
from api_rest.models import Usuario, Participante, Empresa, TechLeader, Extensionista, Excecao
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


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

    def create(self, validated_data):
        # cria user via manager (usa set_password etc)
        return Usuario.objects.create_user(**validated_data)

    def validadte_username(self, username):
        # valid unicidade ignorando o proprio user (qnd update)
        usuario = self.instance
        if Usuario.objects.filter(username=username).exclude(pk=usuario.pk if usuario else None).exists():
            raise serializers.ValidationError("Ja existe um usuario com esse username")
        return username       
    
    
# serializer aninhado p/ Participante
class ParticipanteSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer()  # inclui dados do user embutidos

    class Meta:
        model = Participante
        fields = ['usuario', 'cpf', 'rgm', 'curso', 'outro_curso', 'periodo', 'email_institucional']

    def create(self, validated_data):
        usuario_data = validated_data.pop('usuario')
        # cria user + perfil de forma encadeada
        usuario = Usuario.criar_participante(
            nome=usuario_data['nome'],
            email=usuario_data['username'],
            senha=usuario_data['password'],
            telefone=usuario_data.get('telefone'),
            **validated_data
        )
        return usuario.participante    


# igual ao participante, porem com campos da Empresa
class EmpresaSerializer(serializers.ModelSerializer):
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


# igual aos anteriores, usado p/ techleader
class TechLeaderSerializer(serializers.ModelSerializer):
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
        
        
class ExcecaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Excecao
        fields = ['usuario', 'motivo', 'nota', 'data_inicio']
        
    def create(self, validated_data):
        usuario_data = validated_data.pop('usuario')
        usuario = Usuario.criar_excecao(
            nome=usuario_data['nome'],
            email=usuario_data['username'],
            senha=usuario_data['password'],
            telefone=usuario_data.get('telefone'),
            **validated_data
        )
        return usuario.excecao

class ExtensionistaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Extensionista
        fields = ['participante', 'excecao']
        
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

