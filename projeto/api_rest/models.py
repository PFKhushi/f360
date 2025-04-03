from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models, IntegrityError
from django.core.exceptions import ValidationError
# from django.contrib.auth.models import AbstractUser, Group, Permission

from django.db import models, IntegrityError

# class Usuarios(AbstractUser):
#     class Genero(models.TextChoices):
#         MASCULINO = "M"
#         FEMININO = "F"

#     class Cursos(models.TextChoices):
#         ADS = "ADS", "Análise e Desenvolvimento de Sistemas"
#         CC = "CC", "Ciência da Computação"
#         SI = "SI", "Sistemas para Internet"
#         CD = "CD", "Ciência de Dados"
#         OTR = "OTR", "Outros"

#     class Cargos(models.TextChoices):
#         GESTOR = "GESTOR", "Gestor"
#         IMERSIONISTA = "IMERSIONISTA", "Imersionista"
#         NOVATO = "NOVATO", "Novato"
#         TECH_LEADER = "TECH_LEADER", "Tech Leader"
#         VETERANO = "VETERANO", "Veterano"

#     class Setores(models.TextChoices):
#         GESTAO = "GESTAO", "Gestão"
#         BACK = "BACK", "Back-end"
#         DADOS = "DADOS", "Dados"
#         DEVOPS = "DEVOPS", "DevOps"
#         FRONT = "FRONT", "Front-end"
#         IA = "IA", "Inteligência Artificial"
#         JOGOS = "JOGOS", "Jogos"
#         MOBILE = "MOBILE", "Mobile"
#         PO = "PO", "Product Owner"
#         QA = "QA", "Quality Assurance"
#         UIUX = "UIUX", "UI/UX"

#     class Situacoes(models.TextChoices):
#         ATIVO = "ATIVO", "Ativo"
#         INATIVO = "INATIVO", "Inativo"
#         ESTAGIANDO = "ESTAGIANDO", "Estagiando"

#     nome = models.CharField(verbose_name="Nome completo do usuário", max_length=120)
#     cpf = models.CharField(verbose_name="CPF", max_length=11, null=True, blank=True, unique=True)
#     username = models.EmailField("E-mail do usuário", unique=True)
#     email_institucional = models.EmailField("Email Institucional", unique=True, blank=True, null=True)
#     rgm = models.CharField("Registro Geral de Matrícula da Instituição", max_length=8, unique=True)
#     telefone = models.CharField("Número de Telefone", max_length=15, blank=True, null=True)
#     genero = models.CharField("Gênero", max_length=40, choices=Genero.choices, blank=True, null=True)
#     curso = models.CharField("Curso", max_length=40, choices=Cursos.choices)
#     cargo = models.CharField("Cargo", max_length=15, choices=Cargos.choices)
#     ingresso_fab = models.DateField("Data de ingresso na Fábrica de Software", null=True, blank=True)
#     setor = models.CharField("Setor", max_length=23, choices=Setores.choices, null=True, blank=True)
#     situacao = models.CharField("Situação", max_length=10, choices=Situacoes.choices)
#     is_bolsista = models.BooleanField("É bolsista?", default=False)
#     is_estagiario = models.BooleanField("É estagiário?", default=False)
#     data_criacao = models.DateTimeField("Data de criação do usuário", auto_now_add=True)
#     data_atualizacao = models.DateTimeField("Data de atualização do usuário", auto_now=True)

#     # ✅ Correção do conflito com related_name
#     groups = models.ManyToManyField(Group, related_name="usuarios_groups", blank=True)
#     user_permissions = models.ManyToManyField(Permission, related_name="usuarios_permissions", blank=True)

#     class Meta:
#         verbose_name = "Usuário"
#         verbose_name_plural = "Usuários"

#     def __str__(self):
#         return f"{self.nome} - {self.rgm}"

from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models, IntegrityError
from django.core.exceptions import ValidationError

class UsuarioManager(BaseUserManager):
    """Gerenciador customizado para o modelo Usuario"""
    
    def get_by_natural_key(self, username):
        """Permite login com case-insensitive"""
        return self.get(**{self.model.USERNAME_FIELD: username})
    
    def create_user(self, nome, cpf, username, email_institucional, rgm, password, **extra_fields):
        """Cria e salva um usuário padrão com os campos obrigatórios"""
        if not username:
            raise ValueError(_('O email deve ser fornecido'))
        if not password:
            raise ValueError(_("Senha deve ser fornecida"))
        if not cpf:
            raise ValueError(_("CPF deve ser fornecido"))
        if not nome:
            raise ValueError(_("Nome deve ser fornecido"))
        if not rgm:
            raise ValueError(_("RGM deve ser fornecido"))
        if not email_institucional:
            raise ValueError(_("E-mail institucional deve ser fornecido"))
        
        # Normaliza e-mails
        username = self.normalize_email(username)
        email_institucional = self.normalize_email(email_institucional)
        
        user = self.model(
            nome=nome, 
            cpf=cpf, 
            username=username,
            email_institucional=email_institucional, 
            rgm=rgm, 
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
            cpf="00000000000",  # CPF padrão para admin
            username=username,
            email_institucional=username,  # Usa o mesmo email do username
            rgm="00000000",  # RGM padrão para admin
            password=password,
            **extra_fields
        )


class Usuario(AbstractBaseUser, PermissionsMixin):
    """
    Modelo customizado de usuário que substitui o User padrão do Django
    Adicionado PermissionsMixin, adicionando os campos de permissão/grupos de forma mais simplificada, sem
    precisar trazer campos desnecessários de AbstractUser
    """
    
    # Enums para campos com opções pré-definidas
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

    class Cargos(models.TextChoices):
        GESTOR = "GESTOR", "Gestor"
        IMERSIONISTA = "IMERSIONISTA", "Imersionista"
        NOVATO = "NOVATO", "Novato"
        TECH_LEADER = "TECH_LEADER", "Tech Leader"
        VETERANO = "VETERANO", "Veterano"

    class Setores(models.TextChoices):
        GESTAO = "GESTAO", "Gestão"
        BACK = "BACK", "Back-end"
        DADOS = "DADOS", "Dados"
        DEVOPS = "DEVOPS", "DevOps"
        FRONT = "FRONT", "Front-end"
        IA = "IA", "Inteligência Artificial"
        JOGOS = "JOGOS", "Jogos"
        MOBILE = "MOBILE", "Mobile"
        PO = "PO", "Product Owner"
        QA = "QA", "Quality Assurance"
        UIUX = "UIUX", "UI/UX"

    class Situacoes(models.TextChoices):
        ATIVO = "ATIVO", "Ativo"
        INATIVO = "INATIVO", "Inativo"
        ESTAGIANDO = "ESTAGIANDO", "Estagiando"

    # Campos obrigatórios
    nome = models.CharField(
        verbose_name="Nome completo", 
        max_length=120, 
        unique=True,
        help_text="Nome completo sem abreviações"
    )
    cpf = models.CharField(
        verbose_name="CPF", 
        max_length=11, 
        unique=True,
        validators=[RegexValidator(r'^\d{11}$', message="CPF deve ter exatamente 11 dígitos")],
        help_text="Apenas números (11 dígitos)"
    )
    username = models.EmailField(
        verbose_name="E-mail", 
        unique=True,
        help_text="E-mail principal para login"
    )
    email_institucional = models.EmailField(
        verbose_name="E-mail institucional", 
        unique=True,
        help_text="E-mail acadêmico/institucional"
    )
    rgm = models.CharField(
        verbose_name="RGM", 
        max_length=8, 
        unique=True,
        validators=[RegexValidator(r'^\d{8}$', message="RGM deve ter exatamente 8 dígitos")],
        help_text="Registro Geral de Matrícula"
    )

    # Campos opcionais
    telefone = models.CharField(
        max_length=15, 
        blank=True, 
        null=True,
        help_text="Número para contato"
    )
    genero = models.CharField(
        max_length=2, 
        choices=Genero.choices, 
        default=Genero.NAO_INFORMADO,
        help_text="Identidade de gênero"
    )
    curso = models.CharField(
        max_length=3, 
        choices=Cursos.choices, 
        blank=True, 
        null=True,
        help_text="Curso matriculado"
    )
    cargo = models.CharField(
        max_length=15, 
        choices=Cargos.choices, 
        blank=True, 
        null=True,
        help_text="Cargo na Fábrica de Software"
    )
    ingresso_fab = models.DateField(
        null=True, 
        blank=True,
        help_text="Data de entrada na Fábrica"
    )
    setor = models.CharField(
        max_length=23, 
        choices=Setores.choices, 
        null=True, 
        blank=True,
        help_text="Área de atuação principal"
    )
    situacao = models.CharField(
        max_length=10, 
        choices=Situacoes.choices, 
        blank=True, 
        null=True,
        help_text="Situação acadêmica"
    )

    # Campos booleanos
    is_bolsista = models.BooleanField(
        default=False,
        help_text="Indica se é bolsista"
    )
    is_estagiario = models.BooleanField(
        default=False,
        help_text="Indica se é estagiário"
    )
    
    
    termosAceitos = models.BooleanField(
        #Indica se o usuário aceitou os termos de uso
        default=False,
        help_text="Aceitou os termos de uso do sistema"
    )

    #Contador de projetos concluídos
    projetosEntregues = models.PositiveIntegerField(
        default=0,
        help_text="Quantidade de projetos concluídos"  
    )

    # Campos de controle do Django
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

    # Configurações para o Django
    USERNAME_FIELD = "username"  # Campo usado para login
    REQUIRED_FIELDS = ["nome", "cpf", "email_institucional", "rgm"]

    def save(self, *args, **kwargs):
        """Atualiza automaticamente para Veterano de acordo com a quantidade de projetos entregues"""
        if self.projetosEntregues > 0 and self.cargo != self.Cargos.VETERANO:
            self.cargo = self.Cargos.VETERANO
        super().save(*args, **kwargs)

    @property
    def is_veterano(self):
        """Verifica se o usuário é veterano"""
        return self.cargo == self.Cargos.VETERANO

    def __str__(self):
        """Representação em string do usuário"""
        return f"{self.nome} ({self.username})"

    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"
        constraints = [
            models.CheckConstraint(
                check=models.Q(termosAceitos=True),
                name="termos_aceitos_obrigatorio",
                violation_error_message="Termos de uso devem ser aceitos para registro."
            )
        ]
        '''
        'constraints' garante que termos_aceitos = True, no banco de dados 
        '''
    
    


