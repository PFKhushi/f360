from django.db import models
from api_rest.models import Participante

# Create your models here.


class Imersao(models.Model): # checked
    ano                 = models.IntegerField()
    semestre            = models.IntegerField()
    
    
class FormsInscricao(models.Model):
    participante            = models.OneToOneField(Participante, on_delete=models.CASCADE)
    imersao                 = models.ForeignKey(Imersao, on_delete=models.CASCADE)
    data_inscricao          = models.DateField(auto_now_add=True)
    tecnologias             = models.CharField(max_length=255)
    primeira_opcao          = models.CharField(max_length=255)
    segunda_opcao           = models.CharField(max_length=255)
    Product_Owner           = models.PositiveSmallIntegerField(default=0)
    Gerente_de_Projetos     = models.PositiveSmallIntegerField(default=0)
    Analista_de_requisitos  = models.PositiveSmallIntegerField(default=0)
    Backend_Developer       = models.PositiveSmallIntegerField(default=0)
    Frontend_Developer      = models.PositiveSmallIntegerField(default=0)
    Banco_de_Dados          = models.PositiveSmallIntegerField(default=0)
    Analista_de_Dados       = models.PositiveSmallIntegerField(default=0)
    Desenvolvedor_Mobile    = models.PositiveSmallIntegerField(default=0)
    Desenvolvedor_Jogos     = models.PositiveSmallIntegerField(default=0)
    Quality_Assurance       = models.PositiveSmallIntegerField(default=0)
    Artista_2D              = models.PositiveSmallIntegerField(default=0)
    
    
class Palestra(models.Model):
    titulo                  = models.CharField(max_length=255)
    descricao               = models.TextField()
    data                    = models.DateTimeField()
    imersao                 = models.ForeignKey(Imersao, on_delete=models.CASCADE)
    palestrante             = models.CharField(max_length=255)
    sala                    = models.CharField(max_length=255) 
    
    
class Workshop(models.Model):
    titulo              = models.CharField(max_length=255)
    descricao           = models.TextField()
    data                = models.DateTimeField()
    imersao             = models.ForeignKey(Imersao, on_delete=models.CASCADE)
    palestrante         = models.CharField(max_length=255)
    sala                = models.CharField(max_length=255)
    
    
class ParticipacaoImersao(models.Model):
    participante        = models.OneToOneField(Participante, on_delete=models.CASCADE)
    imersao             = models.ForeignKey(Imersao, on_delete=models.CASCADE)
    data_participacao   = models.DateField(auto_now_add=True)
    
    
class ParticipacaoWorkshop(models.Model):
    participante        = models.OneToOneField(Participante, on_delete=models.CASCADE)
    workshop            = models.ForeignKey(Workshop, on_delete=models.CASCADE)
    desempenho          = models.CharField(max_length=255)
    comentario          = models.TextField()
    especialidade       = models.CharField(max_length=255) # testo mesmo? ou busca no formes?
    classificacao       = models.CharField(max_length=255)
    experiencia         = models.CharField(max_length=255)
    data_participacao   = models.DateField(auto_now_add=True)
    

class PresencaPalestra(models.Model):
    participante        = models.OneToOneField(Participante, on_delete=models.CASCADE)
    palestra            = models.ForeignKey(Palestra, on_delete=models.CASCADE)
    data_participacao   = models.DateField(auto_now_add=True)
    
class PresencaWorkshop(models.Model):
    participante        = models.OneToOneField(Participante, on_delete=models.CASCADE)
    workshop            = models.ForeignKey(Workshop, on_delete=models.CASCADE)
    data_participacao   = models.DateField()
        
    



