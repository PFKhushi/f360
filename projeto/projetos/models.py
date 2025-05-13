from django.db import models
from api_rest.models import Extensionista, TechLeader, Empresa

class Projeto(models.Model):
    
    nome            = models.CharField(max_length=250)
    descricao       = models.CharField(max_length=250)
    area            = models.CharField(max_length=250)
    data_prazo      = models.DateField()
    data_entrega    = models.DateField()
    status          = models.CharField(max_length=250) # desativado | ativo
    etapa_atual     = models.CharField(max_length=250)
    observacoes     = models.TextField()
    data_prazo      = models.DateField()
    progresso       = models.CharField(max_length=250)
    
    techleader = models.ForeignKey(
        TechLeader,
        on_delete=models.CASCADE,
        related_name='projeto_techleader',
        help_text='Tech Leader do projeto'
    )
    emprese = models.ForeignKey(
        Empresa,
        on_delete=models.CASCADE,
        related_name='projeto_empresa',
        help_text='Empresa cliente do projeto' 
    )

class Equipe(models.Model):
    
    extensionista = models.ForeignKey(
        Extensionista,
        on_delete=models.CASCADE,
        related_name='equipe_extensionista',
        help_text='Extensionista membro da equipe'
    )
    projeto = models.ForeignKey(
        Projeto,
        on_delete=models.CASCADE,
        related_name='equipe_projeto',
        help_text='Projeto a qual pertence a equipe'
    )
    cargo = models.CharField(max_length=250)
    status = models.CharField(max_length=250)
    
