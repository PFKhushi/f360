from django.db import models

class Candidato(models.Model):
    cpf = models.CharField(primary_key=True, max_length=11, default='')
    nome_de_usuario = models.CharField(max_length=50, default='')
    email = models.CharField(max_length=50, default='')
    telefone = models.CharField(max_length=11, default='')  # Alterado de IntegerField para CharField

    def __str__(self):
        return f'{self.nome_de_usuario} ({self.cpf})'
