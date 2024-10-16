from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuarios(AbstractUser):
    class Sexo(models.TextChoices):
        MASCULINO = "M"
        FEMININO = "F"

    class Cursos(models.TextChoices):
        ADS = "ADS", "Análise e Desenvolvimento de Sistemas"
        CC = "CC", "Ciência da Computação"
        SI = "SI", "Sistemas para Internet"
        OTR = "OTR", "Outros"  # TODO: Futuramente mapear todos os que podem ou não entrar na Fábrica

    class Cargos(models.TextChoices):
        GESTOR = "GESTOR","Gestor"
        IMERSIONISTA = "IMERSIONISTA","Imersionista"
        NOVATO = "NOVATO","Novato"
        TECH_LEADER = "TECH_LEADER","Tech Leader"
        VETERANO = "VETERANO","Veterano"

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
        """
        Situações possíveis para um usuário

        Ativo: Usuário ativo na Fábrica de Software\n
        Estagiando: Usuário estagiando em outro lugar através da Fábrica de Software\n
        Inativo: Usuário inativo na Fábrica de Software

        """
        ATIVO = "ATIVO", "Ativo"
        INATIVO = "INATIVO", "Inativo"
        ESTAGIANDO = "ESTAGIANDO", "Estagiando"
    
    nome = models.CharField(verbose_name="Nome completo do usuário", max_length=120)
    username = models.EmailField("E-mail do usuário", unique=True)
    data_nasc = models.DateField("Data de nascimento do usuário")
    sexo = models.CharField("Sexo Biológico", max_length=1, choices=Sexo.choices) 
    rgm = models.CharField("Registro Geral de Matrícula da Instituição", max_length=8, unique=True)
    curso = models.CharField("Curso", max_length=40, choices=Cursos.choices)
    cargo = models.CharField("Cargo", max_length=15, choices=Cargos.choices)
    ingresso_inst = models.DateField("Data de ingresso na instituição")
    ingresso_fab = models.DateField("Data de ingresso na Fábrica de Software", null=True, blank=True)
    setor = models.CharField("Setor", max_length=23, choices=Setores.choices, null=True, blank=True)
    situacao = models.CharField("Situação", max_length=10, choices=Situacoes.choices)
    is_bolsista = models.BooleanField("É bolsista?", default=False)
    is_estagiario = models.BooleanField("É estagiário?", default=False)
    data_criacao = models.DateTimeField("Data de criação do usuário", auto_now_add=True)
    data_atualizacao = models.DateTimeField("Data de atualização do usuário", auto_now=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['nome', 'data_nasc', 'sexo', 'rgm', 'curso', 'cargo', 'ingresso_inst', 'situacao']
    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"
    
    def __str__(self):
        return f"{self.nome} - {self.rgm}"

class Experiencias(models.Model):
    class Tecnologias(models.TextChoices):
        BIBLIOTECAS_IA = 'IA', 'Bibliotecas de IA'
        CSS = 'CSS', 'CSS'
        DEPLOY = 'DEPLOY', 'Deploy'
        DJANGO = 'DJANGO_PYTHON', 'Django & Python'
        DOCKER = 'DOCKER', 'Docker or VM'
        DOTNET_CSHARP = '.NET_CSHARP', '.Net & C#'
        FIGMA = 'FIGMA', 'Figma ou Prototipagem'
        FLUTTER = 'FLUTTER', 'Flutter'
        GIT = 'GIT', 'GIT'
        HTML = 'HTML', 'HTML'
        JAVA = 'JAVA', 'Java'
        JAVASCRIPT = 'JAVASCRIPT', 'JavaScript'
        LARAVEL = 'LARAVEL', 'Laravel & PHP'
        LINUX = 'LINUX', 'Linux'
        NEXT_JS = 'NEXT_JS', 'Next.js'
        NODEJS = 'NODEJS', 'Node.js'
        PHP = 'PHP', 'PHP'
        POSTGRESQL_MYSQL = 'POSTGRESQL_MYSQL', 'PostgreSQL or MySQL'
        POWER_BI = 'POWER_BI', 'Power BI'
        PYTHON = 'PYTHON', 'Python'
        REACT_NATIVE = 'REACT_NATIVE', 'React Native'
        SPRING = 'SPRING', 'Spring'
        TABLEU = 'TABLEU', 'Tableu'
        TYPESCRIPT = 'TYPESCRIPT', 'TypeScript'
        UNITY = 'UNITY', 'Unity'

    class Senioridade(models.TextChoices):
        """
        
        JUNIOR: Júnior - Menos de 1 ano de experiência\n
        PLENO: Pleno - De 1 a 3 anos de experiência\n
        SENIOR: Sênior - Mais de 3 anos de experiência\n

        """
        JUNIOR = 'JUNIOR', 'Júnior'
        PLENO = 'PLENO', 'Pleno'
        SENIOR = 'SENIOR', 'Sênior'

    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)
    tecnologias = models.CharField("Tecnologias", max_length=20, choices=Tecnologias.choices)
    senioridade = models.CharField("Senioridade", max_length=10, choices=Senioridade.choices)
    descricao = models.TextField("Descrição da experiência")
    data_criacao = models.DateTimeField("Data de criação da experiência", auto_now_add=True)
    data_atualizacao = models.DateTimeField("Data de atualização da experiência", auto_now=True)

    class Meta:
        verbose_name = "Experiência"
        verbose_name_plural = "Experiências"

    def __str__(self):
        return f"{self.usuario} - {self.tecnologias}" 
