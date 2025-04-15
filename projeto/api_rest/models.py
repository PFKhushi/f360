from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models, IntegrityError
from django.core.exceptions import ValidationError
# from django.contrib.auth.models import AbstractUser, Group, Permission

from django.db import models, IntegrityError


class UsuarioManager(BaseUserManager):
    """Gerenciador customizado para o modelo Usuario"""
    
    def get_by_natural_key(self, username):
        """Permite login com case-insensitive"""
        return self.get(**{self.model.USERNAME_FIELD: username})
    
    def create_user(self, nome, username, password, **extra_fields):
        """Cria e salva um usuário padrão com os campos obrigatórios"""
        if not username:
            raise ValueError(_('O email deve ser fornecido'))
        if not password:
            raise ValueError(_("Senha deve ser fornecida"))
        if not nome:
            raise ValueError(_("Nome deve ser fornecido"))

        # Normaliza e-mails
        username = self.normalize_email(username)
        
        user = self.model(
            nome=nome, 
            username=username,
            **extra_fields
        )
        user.set_password(password)
        try:
            user.save(using=self._db)
        except IntegrityError:
            raise IntegrityError("Violação de campo único (CPF/RGM/Email já existente)")
        return user
    
    def create_superuser(self, username, nome, password, **extra_fields):
        """Cria um superusuário com permissões administrativas"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        # Validações para superusuário
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
    
        nome = models.CharField(
            verbose_name="Nome completo", 
            max_length=120, 
            unique=True,
            help_text="Nome completo sem abreviações"
        )

        username = models.EmailField(
            verbose_name="E-mail", 
            unique=True,
            help_text="E-mail principal para login"
        )
        
        telefone = models.CharField(
            max_length=15, 
            blank=True, 
            null=True,
            help_text="Número para contato"
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

        USERNAME_FIELD = "username"  # Campo usado para login
        REQUIRED_FIELDS = ["nome"]
        
        class Meta:
            verbose_name = "Usuário"
            verbose_name_plural = "Usuários"
        
        def __str__(self):
            """Representação em string do usuário"""
            return f"{self.nome} ({self.username})"


class Participante(Usuario) :

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

    curso = models.CharField(
        max_length=3, 
        choices=Cursos.choices, 
        blank=True, 
        null=True,
        help_text="Curso matriculado"
    )

    cpf = models.CharField(
        verbose_name="CPF", 
        max_length=11, 
        unique=True,
        validators=[RegexValidator(r'^\d{11}$', message="CPF deve ter exatamente 11 dígitos")],
        blank=True,
        help_text="Apenas números (11 dígitos)"
    )

    email_institucional = models.EmailField(
        verbose_name="E-mail institucional", 
        unique=True,
        help_text="E-mail acadêmico/institucional"
    )

    ingresso_fab = models.DateField(
        auto_now=True,
        help_text="Data de entrada na Fábrica"
    )
    
    REQUIRED_FIELDS = ["cpf", "curso", "email_institucional", "ingresso_fab"]

    class Meta:
            verbose_name = "Participante"
            verbose_name_plural = verbose_name+"s"
    
class Empresa(Usuario) :
    
    cnpj = models.CharField(
            verbose_name="CNPJ", 
            max_length=11, 
            unique=True,
            validators=[RegexValidator(r'^\d{14}$', message="CNPJ deve ter exatamente 14 dígitos")],
            blank=True,
            help_text="Apenas números (14 dígitos)"
        )
    
    representante = models.CharField(
        verbose_name="Representante da Empresa",
        max_length=250,
        help_text="Pessoa que representa as decisões da empresa"
    )
    
    REQUIRED_FIELDS = ["cnpj", "representante"]
    
    class Meta:
            verbose_name = "Empresa"
            verbose_name_plural = verbose_name+"s"