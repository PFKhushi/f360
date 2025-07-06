from django.db import models
from api_rest.models import Participante, Extensionista
from django.core.validators import MaxValueValidator, MinValueValidator

class Iteracao(models.Model):
    ano         = models.IntegerField()
    semestre    = models.IntegerField()
    ativa       = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Iteração'
        verbose_name_plural = 'Iterações'
        unique_together = ('ano', 'semestre')
        permissions = [
            ("ver_iteracoes", "Ver todas as iterações"),
            ("editar_iteracoes", "Editar todas as iterações"),
        ]
        
    def __str__(self):
        return f'{self.ano}.{self.semestre}'


class Imersao(models.Model):
    iteracao    = models.OneToOneField(Iteracao, on_delete=models.PROTECT) 
    data_inicio = models.DateField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Imersão'
        verbose_name_plural = 'Imersões'
        permissions = [
            ("ver_imersoes", "Ver todas as imersões"),
            ("editar_imersoes", "Editar todas as imersões"),
        ]
        
    def __str__(self):
        return f'Imersão {self.iteracao.__str__()}'


class AreaFabrica(models.Model):
    nome    = models.CharField(max_length=100, unique=True)
    ativa   = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Área da Fábrica'
        verbose_name_plural = 'Áreas da Fábrica'
        permissions = [
            ("ver_areas_fabrica", "Ver todas as Áreas da Fábrica"),
            ("editar_areas_fabrica", "Editar todas as Áreas da Fábrica"),
        ]
    
    def __str__(self):
        return self.nome


class Tecnologia(models.Model):
    nome    = models.CharField(max_length=100, unique=True)
    ativa  = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Tecnologia'
        verbose_name_plural = 'Tecnologias'
        permissions = [
            ("ver_tecnologia","Ver todas as Tecnologias"),
            ("editar_tecnologia","Editar todas as Tecnologias"),
        ]
    
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
        on_delete=models.PROTECT, 
        related_name='formularios_imersao',
        help_text="Imersão a qual o participante se inscreveu"
    )
    data_inscricao = models.DateField(
        auto_now_add=True, 
        help_text="Data em que o participante se inscreveu na imersão"
    )
    tecnologias = models.ManyToManyField(
        Tecnologia,
        related_name='tecnologias_forms',
        help_text="Tecnologias que o participante tem interesse"
    )
    primeira_opcao = models.ForeignKey(
        AreaFabrica, 
        on_delete=models.PROTECT, 
        related_name='primeira_opcao_forms',
        help_text="Primeira opção de vaga que o participante deseja"
    )
    segunda_opcao = models.ForeignKey(
        AreaFabrica, 
        on_delete=models.PROTECT, 
        related_name='segunda_opcao_forms',
        help_text="Segunda opção de vaga que o participante deseja"
    )
    
    class Meta:
        verbose_name = 'Formulário de Inscrição'
        verbose_name_plural = 'Formulários de Inscrição'
        unique_together = ('participante', 'imersao')
        permissions = [
            ("ver_formularios_workshop","Ver todas as Formulários de Inscrição"),
            ("editar_formularios_workshop","Editar todas as Formulários de Inscrição"),
        ]
    
    def __str__(self):
        return f"Inscrição de {self.participante.__str__()} nos workshops {self.imersao.__str__()}"


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
        permissions = [
            ("ver_interesses_area","Ver todas as Interesses por Área"),
            ("editar_interesses_area","Editar todas as Interesses por Área"),
        ]
    
    def __str__(self):
        return f"{self.area}: {self.nivel}"


class Palestra(models.Model):
    imersao     = models.ForeignKey(
        Imersao, 
        on_delete=models.PROTECT,
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
        permissions = [
            ("ver_palestras","Ver todas as Palestras"),
            ("editar_palestras","Editar todas as Palestras"),
        ]
    
    def __str__(self):
        return f"{self.titulo} - {self.data.strftime('%d/%m/%Y %H:%M')}"


class Workshop(models.Model):
    iteracao = models.ForeignKey(
        Iteracao, 
        on_delete=models.PROTECT, 
        related_name='workshops_iteracao',
        help_text="Iteração a qual o workshop pertence"
    )
    
    area = models.ForeignKey(
        AreaFabrica, 
        on_delete=models.PROTECT
        )
    titulo      = models.CharField(max_length=255)
    descricao   = models.TextField(blank=True, null=True)
    sala        = models.CharField(max_length=255, blank=True, null=True) 
    bloco       = models.CharField(max_length=3, blank=True, null=True)
    
    class Meta:
        verbose_name = 'Workshop'
        verbose_name_plural = 'Workshops'
        unique_together = ('iteracao', 'titulo')
        permissions = [
            ("ver_workshops","Ver todas as Workshops"),
            ("editar_workshop","Editar todas as Workshops"),
        ]

    
    def __str__(self):
        return f"{self.titulo} {self.iteracao.__str__()}: {self.bloco} - {self.sala} "


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
        permissions = [
            ("ver_instrutores_workshops","Ver todos os Instrutores do Workshop"),
            ("editar_instrutores_workshops","Editar todos os Instrutores do Workshop"),
        ]
        
    def __str__(self):
        return f'{self.workshop.__str__()}'


class DiaWorkshop(models.Model):
    workshop = models.ForeignKey(
        Workshop, 
        on_delete=models.CASCADE,
        related_name='dias_workshop',
    )
    data        = models.DateTimeField()
    
    class Meta:
        verbose_name = 'Dia de Workshop'
        verbose_name_plural = 'Dias de Workshop'
        unique_together = ('workshop', 'data')
        permissions = [
            ("ver_dias_workshops","Ver todos os Dias de Workshop"),
            ("editar_dias_workshops","Editar todos os Dias de Workshop"),
        ]
    
    def __str__(self):
        return f"{self.workshop.titulo} - {self.data.strftime('%d/%m/%Y %H:%M')}"


class DesafioWorkshop(models.Model):
    
    participante = models.ForeignKey(
        Participante, 
        on_delete=models.CASCADE,
        related_name='desafio_participante'
        )
    workshop = models.ForeignKey(
        Workshop, 
        on_delete=models.CASCADE,
        related_name='desafio_workshop'
        )
    link = models.CharField(max_length=255)
    
    class Meta:
        db_table = ''
        managed = True
        verbose_name = 'Desafio do workshop'
        verbose_name_plural = 'Desafios dos workshops'
        permissions = [
            ("ver_desafios_workshop","Ver todos os Desafios dos workshops"),
            ("editar_desafios_workshop","Editar todos os Desafios dos workshops"),
        ]
        
    def __str__(self):
        return f'Desafiio de {self.participante.__str__()} no Workshop {self.workshop.__str__()}'


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
        permissions = [
            ("ver_participantes_workshop","Ver todos os Desafios dos workshops"),
            ("editar_participantes_workshop","Editar todos os Desafios dos workshops"),
        ]
        
    def __str__(self):
        return f"{self.participante.__str__()} - {self.workshop.__str__()}"


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
    data_participacao = models.DateField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Participação na Imersão'
        verbose_name_plural = 'Participações na Imersão'
        unique_together = ('participante', 'imersao')
        permissions = [
            ("ver_participacoes_imersao","Ver todos os Participações na Imersão"),
            ("editar_participacoes_imersao","Editar todos os Participações na Imersão"),
        ]
    
    def __str__(self):
        return f"{self.participante.__str__()} - {self.imersao.__str__()}"


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
        permissions = [
            ("ver_presencas_palestras","Ver todos os Presenças na Palestra"),
            ("editar_presencas_palestras","Editar todos os Presenças na Palestra"),
        ]
    
    def __str__(self):
        return f"{self.participante.__str__()} - {self.palestra.titulo}"


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
        permissions = [
            ("ver_presencas_workshops","Ver todas as Presenças nos Workshops"),
            ("editar_presencas_workshops","Editar todas as Presenças nos Workshops"),
        ]
    
    def __str__(self):
        return f"{self.participante.__str__()} - {self.dia_workshop.workshop.titulo} - {self.dia_workshop.data.strftime('%d/%m/%Y')}"


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
        permissions = [
            ("ver_desempenhos_workshops","Ver todos os Desempenhos nos Workshops"),
            ("editar_desempenhos_workshops","Editar todos os Desempenhos nos Workshops"),
        ]
    
    def __str__(self):
        return f"{self.participante.__str__()} - {self.workshop.titulo} - {self.classificacao}"


