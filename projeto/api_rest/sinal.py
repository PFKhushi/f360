from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Participante, Empresa, TechLeader, Usuario

@receiver(post_save, sender=Participante)
def atualizar_tipo_usuario_participante(sender, instance, **kwargs):

    usuario = instance.usuario
    if usuario.tipo_usuario != Usuario.TipoUsuario.PARTICIPANTE:
        usuario.tipo_usuario = Usuario.TipoUsuario.PARTICIPANTE
        usuario.save(update_fields=["tipo_usuario"])

@receiver(post_save, sender=Empresa)
def atualizar_tipo_usuario_empresa(sender, instance, **kwargs):

    usuario = instance.usuario
    if usuario.tipo_usuario != Usuario.TipoUsuario.EMPRESA:
        usuario.tipo_usuario = Usuario.TipoUsuario.EMPRESA
        usuario.save(update_fields=["tipo_usuario"])

@receiver(post_save, sender=TechLeader)
def atualizar_tipo_usuario_techleader(sender, instance, **kwargs):

    usuario = instance.usuario
    if usuario.tipo_usuario != Usuario.TipoUsuario.TECHLEADER:
        usuario.tipo_usuario = Usuario.TipoUsuario.TECHLEADER
        usuario.save(update_fields=["tipo_usuario"])