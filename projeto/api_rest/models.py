from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class Usuarios(AbstractUser):
    class Genero(models.TextChoices):
        MASCULINO = "M"
        FEMININO = "F"

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

    nome = models.CharField(verbose_name="Nome completo do usuário", max_length=120)
    cpf = models.CharField(verbose_name="CPF", max_length=11, null=True, blank=True, unique=True)
    username = models.EmailField("E-mail do usuário", unique=True)
    email_institucional = models.EmailField("Email Institucional", unique=True, blank=True, null=True)
    rgm = models.CharField("Registro Geral de Matrícula da Instituição", max_length=8, unique=True)
    telefone = models.CharField("Número de Telefone", max_length=15, blank=True, null=True)
    genero = models.CharField("Gênero", max_length=40, choices=Genero.choices, blank=True, null=True)
    curso = models.CharField("Curso", max_length=40, choices=Cursos.choices)
    cargo = models.CharField("Cargo", max_length=15, choices=Cargos.choices)
    ingresso_fab = models.DateField("Data de ingresso na Fábrica de Software", null=True, blank=True)
    setor = models.CharField("Setor", max_length=23, choices=Setores.choices, null=True, blank=True)
    situacao = models.CharField("Situação", max_length=10, choices=Situacoes.choices)
    is_bolsista = models.BooleanField("É bolsista?", default=False)
    is_estagiario = models.BooleanField("É estagiário?", default=False)
    data_criacao = models.DateTimeField("Data de criação do usuário", auto_now_add=True)
    data_atualizacao = models.DateTimeField("Data de atualização do usuário", auto_now=True)

    # ✅ Correção do conflito com related_name
    groups = models.ManyToManyField(Group, related_name="usuarios_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="usuarios_permissions", blank=True)

    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"

    def __str__(self):
        return f"{self.nome} - {self.rgm}"
