from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
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

class UsuarioManager(BaseUserManager):
    
    def get_by_natural_key(self, username):
        return self.get(**{self.model.USERNAME_FIELD: username})
    
    def create_user(self, nome, cpf, username, email_institucional, rgm, password, **campos_restantes):

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
            raise ValueError(_("E-mail da instituição deve ser fornecido"))
        
        username = self.normalize_email(username)
        email_institucional = self.normalize_email(email_institucional)
        user = self.model(nome=nome, cpf=cpf, username=username, 
                        email_institucional=email_institucional, rgm=rgm, 
                        **campos_restantes)
        user.set_password(password)
        try:
            user.save(using=self._db)
        except IntegrityError:
            raise IntegrityError("Violação de campo único")
        return user
        
    def create_superuser(self, username, nome, password, **campos_restantes):
        
        campos_restantes.setdefault('is_staff', True)
        campos_restantes.setdefault('is_active', True)
        campos_restantes.setdefault('is_superuser', True)
        
        if campos_restantes.get('is_staff') is not True:
            raise ValueError(_("Super User deve definir is_staff=True"))
        if campos_restantes.get('is_active') is not True:
            raise ValueError(_("Super User deve definir is_active=True"))
        if campos_restantes.get('is_superuser') is not True:
            raise ValueError(_("Super User deve definir is_superuser=True"))
        
        return self.create_user(nome=nome, cpf="00000000000", username=username, 
                                email_institucional=username, rgm="00000000", 
                                password=password, **campos_restantes) 
        
        

class Usuario(AbstractBaseUser, PermissionsMixin):
    
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
        # nome, cpf, username, rgm
    nome                = models.CharField( verbose_name=_("Nome completo do usuário"), max_length=120, 
                                            help_text=_("Digite seu nome completo sem abrevições"), unique=True) ###########
                                            # talvez nome devesse ser unique
    
    cpf                 = models.CharField( verbose_name="CPF", max_length=11, 
                                            help_text=_("Digite apenas números (11 dígitos)."),
                                            validators=[
                                                RegexValidator(
                                                    r'^\d{11}$',    # ^ = início str 
                                                                    # \d{11} = 11 digitos
                                                                    # $ = fim str
                                                    message="CPF deve conter exatamente 11 dígitos numéricos"
                                                )
                                            ],
                                            unique=True)############
    
    username            = models.EmailField(verbose_name=_("E-mail do usuário"), 
                                            help_text=_("E-mail para autenticar usuário"), unique=True)##########
    
    email_institucional = models.EmailField(verbose_name=_("Email Institucional"),
                                            help_text=_("E-mail institucional para permitir ingresso na fábrica de software"), 
                                            unique=True)###########
    
    rgm                 = models.CharField( verbose_name=_("Registro Geral de Matrícula da Instituição"), max_length=8,
                                            help_text=_("RGM ativo para ingresso na fábrica de software"),
                                            validators=[
                                                RegexValidator(
                                                    r'^\d{8}$', 
                                                    message="CPF deve conter exatamente 11 dígitos numéricos"
                                                )
                                            ],
                                            unique=True)###########
    
    telefone            = models.CharField( verbose_name=_("Número de Telefone"), max_length=15,
                                            help_text=_("Número de telefone para contacto"), 
                                            blank=True, null=True)
    
    genero              = models.CharField( verbose_name=_("Gênero"), max_length=2, 
                                            help_text=_("Selecione a opção que melhor representa sua identidade de gênero. "),
                                            default=Genero.NAO_INFORMADO,
                                            choices=Genero.choices, blank=True, null=True)
    
    curso               = models.CharField( verbose_name=_("Curso"), max_length=3, 
                                            help_text=_("Selecione o curso conforme sua matrícula ativa"),
                                            choices=Cursos.choices, blank=True, null=True)
    
    cargo               = models.CharField( verbose_name=_("Cargo"), max_length=15, 
                                            help_text=_("Selecione seu cargo na Fábrica Software"),
                                            choices=Cargos.choices, blank=True, null=True)
    
    ingresso_fab        = models.DateField( verbose_name=_("Data de ingresso na Fábrica de Software"),
                                            help_text=_(""),
                                            null=True, blank=True)
    
    setor               = models.CharField( verbose_name=_("Setor"), max_length=23, 
                                            help_text=_(
                                                "Em qual time você atuará? Essa informação nos ajuda a direcionar seus acessos e recursos. "
                                                "Se atuar em múltiplos setores, escolha o principal."
                                                ),
                                            choices=Setores.choices, null=True, blank=True)
    
    situacao            = models.CharField( verbose_name=_("Situação"), max_length=10,
                                            help_text="Situações: ATIVO, INATIVO, ESTAGIANDO", 
                                            choices=Situacoes.choices, blank=True, null=True)
    
    is_bolsista         = models.BooleanField(verbose_name=_("É bolsista?"), default=False,
                                            help_text="")
    is_estagiario       = models.BooleanField(verbose_name=_("É estagiário?"), default=False)   # é realmente necessário?  
                                                                                                # Tendo em conta o atributo situacao
    data_criacao        = models.DateTimeField(verbose_name=_("Data de criação do usuário"), auto_now_add=True)
    data_atualizacao    = models.DateTimeField(verbose_name=_("Data de atualização do usuário"), auto_now=True)
    
    is_active = models.BooleanField(verbose_name=_("Estado de conta ativa ou não"), default=True,)
    is_staff = models.BooleanField(verbose_name=("Estado de staff ativo ou não"), default=False,)
    
    
    objects = UsuarioManager()
    
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["nome"]
    
    class Meta:
        db_table = 'Usuario'
        managed = True
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
    
    def __str__(self):
        return f"{self.nome} - {self.rgm}"
    
    


