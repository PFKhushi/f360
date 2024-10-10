from django.db import models

# Create your models here.
class UsuarioModel(models.Model):
    class CargoChoices(models.IntegerChoices):
        ADMIN = 0
        TECH_LEADER = 1
        INSTRUTOR = 2
        VETERANO = 3
        NOVATO = 4
        IMERSIONISTA = 5
    

    nome = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    cpf = models.CharField(max_length=14)
    cargo = models.IntegerField(choices=CargoChoices.choices, default=CargoChoices.IMERSIONISTA)

    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
    def __str__(self):
        return self.nome, self.email, self.cpf, self.cargo
    