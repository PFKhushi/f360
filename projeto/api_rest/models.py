from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models, IntegrityError, transaction
from django.core.exceptions import ValidationError
from encrypted_model_fields.fields import EncryptedCharField, EncryptedEmailField
from django.core.validators import MaxValueValidator, MinValueValidator


class UsuarioManager(BaseUserManager):
    
    def get_by_natural_key(self, username):

        return self.get(**{f"{self.model.USERNAME_FIELD}__iexact": username})
    
    def get_username(self):
        return self.username
    
    def create_user(self, nome, username, password, **extra_fields):
        
        if not username:
            raise ValueError(_('O email deve ser fornecido'))
        if not password:
            raise ValueError(_("Senha deve ser fornecida"))
        if not nome:
            raise ValueError(_("Nome deve ser fornecido"))

        username = self.normalize_email(username).lower()
        
        extra_fields.setdefault('is_active', True)
        
        user = self.model(
            nome=nome, 
            username=username,
            **extra_fields
        )
        
        user.set_password(password)
        
        try:
            
            user.save(using=self._db)
            
        except IntegrityError:
            
            raise IntegrityError("Violação de campo único (Email já existente)")
        
        return user
    
    def create_superuser(self, username, nome, password, **extra_fields):
        
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            
            raise ValueError(_("Superusuário deve ter is_staff=True"))
        
        if extra_fields.get('is_superuser') is not True:
            
            raise ValueError(_("Superusuário deve ter is_superuser=True"))
        
        return self.create_user(
            nome=nome,
            username=username,
            password=password,
            **extra_fields
        )


class Usuario(AbstractBaseUser, PermissionsMixin):
    class TipoUsuario(models.TextChoices):
        ADMIN = "ADMIN", "Administrador"
        PARTICIPANTE = "PART", "Participante"
        EMPRESA = "EMP", "Empresa"
        TECHLEADER = "TECH", "Tech Leader"
        NAO_DEFINIDO = "ND", "Não Definido"

    nome = models.CharField(
        verbose_name="Nome completo", 
        max_length=120, 
        help_text="Nome completo sem abreviações"
    )

    username = models.EmailField( 
        verbose_name="E-mail", 
        unique=True,
        help_text="E-mail principal para login"
    )
    
    telefone = EncryptedCharField( 
        max_length=15, 
        blank=True, 
        null=True,
        help_text="Número para contato"
    )
    
    tipo_usuario = models.CharField(
        max_length=5,
        choices=TipoUsuario.choices,
        default=TipoUsuario.NAO_DEFINIDO,
        help_text="Tipo de usuário no sistema"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Conta ativa/inativa"
    )
    
    is_staff = models.BooleanField(
        default=False,
        help_text="Acesso ao admin"
    )
    
    data_criacao = models.DateTimeField(
        auto_now_add=True,
        help_text="Data de registro no sistema"
    )
    
    data_atualizacao = models.DateTimeField(
        auto_now=True,
        help_text="Última atualização"
    )
    
    objects = UsuarioManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["nome"]
    
    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"
    
    def __str__(self):
        return f"{self.nome} ({self.username})"
    
    
    def get_tipo_usuario(self):
        if hasattr(self, 'participante'):
            return self.TipoUsuario.PARTICIPANTE
        elif hasattr(self, 'empresa'):
            return self.TipoUsuario.EMPRESA
        elif hasattr(self, 'techleader'):
            return self.TipoUsuario.TECHLEADER
        elif self.is_staff or self.is_superuser:
            return self.TipoUsuario.ADMIN
        return self.TipoUsuario.NAO_DEFINIDO
        
    @staticmethod
    def criar_participante(nome,  email, rgm, senha, cpf, curso, outro_curso, periodo, email_institucional, **extras):
        usuario = Usuario.objects.create_user(
            nome=nome,
            username=email,
            password=senha,
            **extras
        )
        Participante.objects.create(
            usuario=usuario,
            cpf=cpf,
            rgm=rgm,
            curso=curso,
            outro_curso=outro_curso,
            periodo=periodo,
            email_institucional=email_institucional
        )
        return usuario

    @staticmethod
    def criar_empresa(nome, email, senha, cnpj, representante, **extras):
        usuario = Usuario.objects.create_user(
            nome=nome,
            username=email,
            password=senha,
            **extras
        )
        Empresa.objects.create(
            usuario=usuario,
            cnpj=cnpj,
            representante=representante
        )
        return usuario

    @staticmethod
    def criar_techleader(nome, email, senha, codigo, especialidade, **extras):
        usuario = Usuario.objects.create_user(
            nome=nome,
            username=email,
            password=senha,
            **extras
        )
        TechLeader.objects.create(
            usuario=usuario,
            codigo=codigo,
            especialidade=especialidade
        )
        return usuario
    
    @staticmethod
    def criar_excecao(nome, email, senha, motivo, nota, **extras):
        usuario = Usuario.objects.create_user(
            nome=nome,
            username=email,
            password=senha,
            **extras
        )
        Excecao.objects.create(
            usuario=usuario,
            motivo=motivo,
            nota=nota
        )
        return usuario
    
    @property
    def is_participante(self):
        return hasattr(self, 'participante')
    
    @property
    def is_empresa(self):
        return hasattr(self, 'empresa')
    
    @property
    def is_techleader(self):
        return hasattr(self, 'techleader')
    
    @property
    def is_excecao(self):
        return hasattr(self, 'excecao')


class Participante(models.Model):
    class Genero(models.TextChoices):
        NAO_INFORMADO = "NI", "Não informado"
        MASCULINO = "M", "Masculino"
        FEMININO = "F", "Feminino"
        NAO_APLICAVEL = "NA", "Não aplicável"

    class Cursos(models.TextChoices):
        ADS = "ADS", "Análise e Desenvolvimento de Sistemas"
        CC = "CC", "Ciência da Computação"
        SI = "SI", "Sistemas para Internet"
        CD = "CD", "Ciência de Dados"
        OTR = "OTR", "Outros"

    usuario = models.OneToOneField(
        Usuario, 
        on_delete=models.CASCADE, 
        related_name='participante')

    curso = models.CharField(
        max_length=3, 
        choices=Cursos.choices, 
        blank=True, 
        null=True,
        help_text="Curso matriculado"
    )
    outro_curso = models.CharField(
        max_length=100, 
        blank=True, 
        null=True,
        help_text="Caso o curso não esteja listado"
    )
    
    periodo = models.IntegerField(
        blank=True, 
        null=True,
        help_text="Período atual do curso"
    )

    cpf = EncryptedCharField( 
        verbose_name="CPF", 
        max_length=11, 
        unique=True,
        validators=[RegexValidator(r'^\d{11}$', message="CPF deve ter exatamente 11 dígitos")],
        help_text="Apenas números (11 dígitos)"
    )
    
    rgm = EncryptedCharField( 
        verbose_name="RGM", 
        max_length=11, 
        unique=True,
        validators=[RegexValidator(r'^\d{8}$', message="RGM deve ter exatamente 8 dígitos")],
        help_text="Apenas números (8 dígitos)"
    )

    email_institucional = EncryptedEmailField( 
        verbose_name="E-mail institucional", 
        unique=True,
        help_text="E-mail acadêmico/institucional"
    )

    ingresso_fab = models.DateField(
        auto_now_add=True,
        help_text="Data de entrada na Fábrica"
    )

    class Meta:
        verbose_name = "Participante"
        verbose_name_plural = "Participantes"
        permissions = [
            ("ver_todos_participantes", "Pode ver todos os participantes"),
            # ("",""),
        ]

    def __str__(self):
        
        return f"Participante: {self.usuario.nome}"
    
    def save(self, *args, **kwargs):
        
        if hasattr(self.usuario, 'empresa') or hasattr(self.usuario, 'techleader'):
            
            raise ValidationError(
                "Este usuário já está registrado com outro perfil."
            )
        
        super().save(*args, **kwargs) 


class Empresa(models.Model):
    usuario = models.OneToOneField(
        Usuario, 
        on_delete=models.CASCADE, 
        related_name='empresa')

    cnpj = models.CharField(
        verbose_name="CNPJ", 
        max_length=14, 
        unique=True,
        validators=[RegexValidator(r'^\d{14}$', message="CNPJ deve ter exatamente 14 dígitos")],
        help_text="Apenas números (14 dígitos)"
    )

    representante = models.CharField(
        verbose_name="Representante da Empresa",
        max_length=250,
        help_text="Pessoa que representa as decisões da empresa"
    )
    
    class Meta:
        verbose_name = "Empresa"
        verbose_name_plural = "Empresas"
        permissions = [
            ("ver_todas_empresas", "Pode ver todos os participantes"),
            # ("",""),
        ]

    def __str__(self):
        return f"Empresa: {self.usuario.nome}"
    
    def save(self, *args, **kwargs):
        
        if hasattr(self.usuario, 'participante') or hasattr(self.usuario, 'techleader'):
            
            raise ValidationError( 
                "Este usuário já está registrado com outro perfil."
            )
        
        super().save(*args, **kwargs)


class TechLeader(models.Model):
    usuario = models.OneToOneField(
        Usuario, 
        on_delete=models.CASCADE, 
        related_name='techleader')
    
    codigo = EncryptedCharField(
        verbose_name="Código único que identifica Tech Leader", 
        max_length=20, 
        unique=True,
        validators=[RegexValidator(r'^\d+$', message="Código deve conter apenas números")],
        help_text="Registro Geral sem pontos ou traços"
    )
    
    data_inicio = models.DateField(
        auto_now_add=True,
        help_text="Data de início como Tech Leader"
    )
    
    especialidade = models.CharField(
        max_length=100,
        help_text="Área de especialidade técnica"
    )
    
    class Meta:
        verbose_name = "Tech Leader"
        verbose_name_plural = "Tech Leaders"
        permissions = [
            ("ver_todos_techleaders", "Pode ver todos os tech leaders"),
        ]

    def __str__(self):
        
        return f"Tech Leader: {self.usuario.nome}"
    
    def save(self, *args, **kwargs):
        
        if hasattr(self.usuario, 'participante') or hasattr(self.usuario, 'empresa'):
            
            raise ValidationError(
                "Este usuário já está registrado com outro perfil."
            )
            
        super().save(*args, **kwargs) 
        

class Excecao(models.Model):
    
    usuario = models.OneToOneField(
        Usuario, 
        on_delete=models.CASCADE, 
        related_name='excecao'
    )
    motivo = models.CharField(
        max_length=255, 
        help_text="Motivo da exceção"
    )
    nota = models.CharField(max_length=255, blank=True, null=True)
    data_inicio = models.DateField(
        auto_now_add=True,
        help_text="Data de início da exceção"
    )
    
    class Meta:
        verbose_name = "Exceção"
        verbose_name_plural = "Exceções"
        permissions = [
            ("ver_todas_excecoes", "Pode ver todas as exceções"),
        ]
    
    
class Extensionista(models.Model):
    
    participante = models.ForeignKey( # Falta app de gestão de projeto para fazer o relacionamento
        Participante, 
        on_delete=models.CASCADE, 
        related_name='extensionista',
        null=True, blank=True
    )
    excecao = models.ForeignKey(
        Excecao, 
        on_delete=models.CASCADE, 
        related_name='extensionista',
        null=True, blank=True
    )
    veterano = models.BooleanField(
        default=False,
        help_text="Indica se o extensionista é veterano"
    )
    
    class Meta:
        verbose_name = "Extensionista"
        verbose_name_plural = "Extensionistas"
        permissions = [
            ("ver_todos_extensionistas", "Pode ver todos os extensionistas"),
        ]
    
    
