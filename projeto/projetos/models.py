from django.db import models
from api_rest.models import Extensionista, TechLeader, Empresa
from imersao.models import AreaFabrica
from django.core.validators import MinValueValidator, MaxValueValidator

class Projeto(models.Model):

    class StatusProjeto(models.TextChoices):
        ATIVO = 'ativo', 'Ativo'
        PAUSADO = 'pausado', 'Pausado'
        CONCLUIDO = 'concluido', 'Concluído'
        CANCELADO = 'cancelado', 'Cancelado'

    class EtapaProjeto(models.TextChoices):
        PLANEJAMENTO = 'planejamento', 'Planejamento'
        DESENVOLVIMENTO = 'desenvolvimento', 'Desenvolvimento'
        TESTES = 'testes', 'Testes'
        IMPLANTACAO = 'implantacao', 'Implantação'
        CONCLUIDO = 'concluido', 'Concluído'

    nome = models.CharField(max_length=250, help_text="Nome oficial do projeto")
    descricao = models.TextField(help_text="Descrição detalhada do escopo e objetivos do projeto")
    area = models.CharField(max_length=150, help_text="Área de negócio ou departamento ao qual o projeto pertence")
    data_prazo = models.DateField(help_text="Prazo final para a conclusão do projeto")
    data_entrega = models.DateField(null=True, blank=True, help_text="Data em que o projeto foi efetivamente entregue (preencher ao concluir)")
    status = models.CharField(max_length=20, choices=StatusProjeto.choices, default=StatusProjeto.ATIVO, help_text="Status atual do projeto")
    etapa_atual = models.CharField(max_length=20, choices=EtapaProjeto.choices, default=EtapaProjeto.PLANEJAMENTO, help_text="Etapa em que o projeto se encontra")
    observacoes = models.TextField(blank=True, null=True, help_text="Observações gerais, anotações e pontos de atenção")
    progresso = models.PositiveIntegerField(
        default=0,
        validators=[MaxValueValidator(100)],
        help_text="Progresso do projeto em porcentagem (de 0 a 100)"
    )

    techleader = models.ForeignKey(
        TechLeader,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='projetos_liderados',
        help_text='Tech Leader responsável pelo projeto'
    )
    empresa = models.ForeignKey(
        Empresa,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='projetos_contratados',
        help_text='Empresa cliente para a qual o projeto está sendo desenvolvido'
    )
    
    equipe = models.ManyToManyField(
        Extensionista,
        blank=True,
        through='MembroEquipe', 
        related_name='projetos_participantes'
    )

    class Meta:
        ordering = ['-data_prazo', 'nome'] 
        verbose_name = "Projeto"
        verbose_name_plural = "Projetos"

    def __str__(self):
        return self.nome


class MembroEquipe(models.Model):

    class StatusMembro(models.TextChoices):
        ATIVO = 'ativo', 'Ativo'
        INATIVO = 'inativo', 'Inativo'

    extensionista = models.ForeignKey(
        Extensionista,
        on_delete=models.CASCADE,
        related_name='alocacoes',
        help_text='Extensionista que faz parte da equipe'
    )
    projeto = models.ForeignKey(
        Projeto,
        on_delete=models.CASCADE,
        related_name='membros', 
        help_text='Projeto ao qual o membro está alocado'
    )

    cargo = models.ManyToManyField(
        AreaFabrica, 
        related_name='cargos',
        help_text="Area da Fábrica referente ao cargo ou função do membro dentro deste projeto")
    status = models.CharField(max_length=20, choices=StatusMembro.choices, default=StatusMembro.ATIVO, help_text="Status do membro nesta equipe específica")

    class Meta:
        verbose_name = "Membro da Equipe"
        unique_together = ('projeto', 'extensionista')
        verbose_name_plural = "Membros das Equipes"
        ordering = ['projeto', 'extensionista']

    def __str__(self):
        return f'{self.extensionista} como {self.cargo} no projeto {self.projeto}'
