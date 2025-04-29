from django.db import models
from api_rest.models import Participante, Extensionista
from django.core.validators import MaxValueValidator, MinValueValidator


class Imersao(models.Model):
    ano         = models.IntegerField()
    semestre    = models.IntegerField()
    
    class Meta:
        verbose_name = 'Imersão'
        verbose_name_plural = 'Imersões'
        unique_together = ('ano', 'semestre')
    
    def __str__(self):
        return f"{self.ano}.{self.semestre}"


class AreaFabrica(models.Model):
    nome    = models.CharField(max_length=100)
    ativa   = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Área da Fábrica'
        verbose_name_plural = 'Áreas da Fábrica'
    
    def __str__(self):
        return self.nome


class Tecnologia(models.Model):
    nome    = models.CharField(max_length=100, unique=True)
    ativa  = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Tecnologia'
        verbose_name_plural = 'Tecnologias'
    
    def __str__(self):
        return self.nome


class FormularioInscricao(models.Model):
    participante = models.ForeignKey(
        Participante, 
        on_delete=models.CASCADE, 
        related_name='formularios_participante',
        help_text="Participante que preencheu o formulário"
    )
    imersao = models.ForeignKey(
        Imersao, 
        on_delete=models.CASCADE, 
        related_name='formularios_imersao',
        help_text="Imersão a qual o participante se inscreveu"
    )
    data_inscricao = models.DateField(
        auto_now_add=True, 
        help_text="Data em que o participante se inscreveu na imersão"
    )
    tecnologias = models.ManyToManyField(
        Tecnologia,
        help_text="Tecnologias que o participante tem interesse"
    )
    primeira_opcao = models.ForeignKey(
        AreaFabrica, 
        on_delete=models.CASCADE, 
        related_name='primeira_opcao_forms',
        help_text="Primeira opção de vaga que o participante deseja"
    )
    segunda_opcao = models.ForeignKey(
        AreaFabrica, 
        on_delete=models.CASCADE, 
        related_name='segunda_opcao_forms',
        help_text="Segunda opção de vaga que o participante deseja"
    )
    
    class Meta:
        verbose_name = 'Formulário de Inscrição'
        verbose_name_plural = 'Formulários de Inscrição'
        unique_together = ('participante', 'imersao')
    
    def __str__(self):
        return f"Inscrição de {self.participante} na imersão {self.imersao}"


class InteresseArea(models.Model):
    formulario = models.ForeignKey(
        FormularioInscricao, 
        on_delete=models.CASCADE,
        related_name='interesses_forms'
    )
    area = models.ForeignKey(
        AreaFabrica, 
        on_delete=models.CASCADE
    )
    nivel = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        help_text="Nível de interesse na área entre 0 e 5"
    )
    
    class Meta:
        verbose_name = 'Interesse por Área'
        verbose_name_plural = 'Interesses por Área'
        unique_together = ('formulario', 'area')
    
    def __str__(self):
        return f"{self.formulario.participante} - {self.area}: {self.nivel}"


class Palestra(models.Model):
    imersao     = models.ForeignKey(
        Imersao, 
        on_delete=models.CASCADE,
        related_name='palestras_imersao',
        help_text="Imersão a qual a palestra pertence"
    )
    titulo      = models.CharField(max_length=255)
    descricao   = models.TextField(null=True, blank=True)
    data        = models.DateTimeField(null=True, blank=True)
    palestrante = models.CharField(max_length=255)
    sala        = models.CharField(max_length=255, null=True, blank=True) 
    bloco       = models.CharField(max_length=10, null=True, blank=True)
    
    class Meta:
        verbose_name = 'Palestra'
        verbose_name_plural = 'Palestras'
        unique_together = ('imersao', 'titulo')
    
    def __str__(self):
        return f"{self.titulo} - {self.data.strftime('%d/%m/%Y %H:%M')}"


class Workshop(models.Model):
    imersao = models.ForeignKey(
        Imersao, 
        on_delete=models.CASCADE, 
        related_name='workshops_imersao',
        help_text="Imersão a qual o workshop pertence"
    )
    titulo      = models.CharField(max_length=255)
    descricao   = models.TextField()
    sala        = models.CharField(max_length=255) 
    bloco       = models.CharField(max_length=2)
    
    class Meta:
        verbose_name = 'Workshop'
        verbose_name_plural = 'Workshops'
        unique_together = ('imersao', 'titulo')
    
    def __str__(self):
        return f"{self.titulo}: {self.bloco} - {self.sala}"

class InstrutorWorkshop(models.Model):
    workshop = models.ForeignKey(
        Workshop,
        on_delete=models.CASCADE,
        related_name='instrutores_workshop',
        help_text="Workshop ao qual o instrutor pertence"
    )
    extensionista = models.ForeignKey(
        Extensionista,
        on_delete=models.CASCADE,
        related_name='workshop_instruidos',
        help_text="Extensionista que é instrutor do workshop"
    )
    
    class Meta:
        verbose_name = 'Instrutor do Workshop'
        verbose_name_plural = 'Instrutores do Workshop'
        unique_together = ('workshop', 'extensionista')
    
    
class DiaWorkshop(models.Model):
    workshop = models.ForeignKey(
        Workshop, 
        on_delete=models.CASCADE,
        related_name='dias_workshop',
    )
    data        = models.DateTimeField()
    conteudo    = models.CharField(max_length=255)
    
    class Meta:
        verbose_name = 'Dia de Workshop'
        verbose_name_plural = 'Dias de Workshop'
        unique_together = ('workshop', 'data')
    
    def __str__(self):
        return f"{self.workshop.titulo} - {self.data.strftime('%d/%m/%Y %H:%M')}"


class ParticipantesWorkshop(models.Model):
    participante = models.ForeignKey(
        Participante, 
        on_delete=models.CASCADE,
        related_name='workshops_participante',
        help_text="Participante inscrito no workshop"
    )
    workshop = models.ForeignKey(
        Workshop, 
        on_delete=models.CASCADE,
        related_name='participantes_workshop',
        help_text="Workshop ao qual o participante está inscrito"
    )
    
    class Meta:
        verbose_name = 'Participação no Workshop'
        verbose_name_plural = 'Participações no Workshop'
        unique_together = ('participante', 'workshop')
        
    def __str__(self):
        return f"{self.participante} - {self.workshop.titulo}"


class ParticipacaoImersao(models.Model):
    participante = models.ForeignKey(
        Participante, 
        on_delete=models.CASCADE,
        related_name='imersoes_participadas',
        help_text="Participante que participou da imersão"
    )
    imersao = models.ForeignKey(
        Imersao, 
        on_delete=models.CASCADE,
        related_name='participantes_imersao',
        help_text="Imersão na qual o participante participou"
    )
    data_participacao   = models.DateField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Participação na Imersão'
        verbose_name_plural = 'Participações na Imersão'
        unique_together = ('participante', 'imersao')
    
    def __str__(self):
        return f"{self.participante} - {self.imersao}"


class PresencaPalestra(models.Model):
    participante = models.ForeignKey(
        Participante, 
        on_delete=models.CASCADE,
        related_name='palestras_participadas',
        help_text="Participante que participou da palestra"
    )
    palestra = models.ForeignKey(
        Palestra, 
        on_delete=models.CASCADE,
        related_name='participantes_palestra',
        help_text="Palestra na qual o participante participou"
    )
    data_participacao   = models.DateField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Presença na Palestra'
        verbose_name_plural = 'Presenças na Palestra'
        unique_together = ('participante', 'palestra')
    
    def __str__(self):
        return f"{self.participante} - {self.palestra.titulo}"


class PresencaWorkshop(models.Model):
    participante = models.ForeignKey(
        Participante, 
        on_delete=models.CASCADE,
        related_name='workshops_participados',
        help_text="Participante que participou do workshop"
    )
    dia_workshop = models.ForeignKey(
        DiaWorkshop, 
        on_delete=models.CASCADE,
        related_name='participantes_dia_workshop',
        help_text="Dia do workshop no qual o participante participou"
    )
    data_registro = models.DateField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Presença no Workshop'
        verbose_name_plural = 'Presenças no Workshop'
        unique_together = ('participante', 'dia_workshop')
    
    def __str__(self):
        return f"{self.participante} - {self.dia_workshop.workshop.titulo} - {self.dia_workshop.data.strftime('%d/%m/%Y')}"


class DesempenhoWorkshop(models.Model):
    participante = models.ForeignKey(
        Participante, 
        on_delete=models.CASCADE,
        related_name='desempenho_workshops',
        help_text="Participante que teve seu desempenho avaliado"
    )
    workshop = models.ForeignKey(
        Workshop, 
        on_delete=models.CASCADE,
        related_name='desempenhos_workshop',
        help_text="Workshop ao qual o desempenho se refere"
    )
    desempenho      = models.CharField(max_length=255)
    comentario      = models.TextField(blank=True, null=True)
    especialidade   = models.ForeignKey(
        Tecnologia, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='especialidade_desempenho',
        help_text="Tecnologia que o participante se destacou no workshop"
    )
    aprovado        = models.BooleanField(default=False)
    classificacao   = models.CharField(max_length=255)
    experiencia     = models.CharField(max_length=255)
    data_avaliacao  = models.DateField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Desempenho no Workshop'
        verbose_name_plural = 'Desempenhos nos Workshops'
        unique_together = ('participante', 'workshop')
    
    def __str__(self):
        return f"{self.participante} - {self.workshop.titulo} - {self.classificacao}"


