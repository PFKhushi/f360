from django.db.models.signals import post_save, pre_delete as delete
from django.dispatch import receiver
from .models import Participante, Empresa, TechLeader, Usuario


# dispara qnd um Participante eh salvo
@receiver(post_save, sender=Participante)
def atualizar_tipo_usuario_participante(sender, instance, **kwargs):
    usuario = instance.usuario
    if not usuario.is_active:
        usuario.is_active = True  # ativa usuario caso esteja inativo
    if usuario.tipo_usuario != Usuario.TipoUsuario.PARTICIPANTE:
        usuario.tipo_usuario = Usuario.TipoUsuario.PARTICIPANTE
        usuario.save(update_fields=["tipo_usuario"])  # atualiza tipo_usuario


# dispara qnd uma Empresa eh salva
@receiver(post_save, sender=Empresa)
def atualizar_tipo_usuario_empresa(sender, instance, **kwargs):
    usuario = instance.usuario
    if usuario.tipo_usuario != Usuario.TipoUsuario.EMPRESA:
        usuario.tipo_usuario = Usuario.TipoUsuario.EMPRESA
        usuario.save(update_fields=["tipo_usuario"])  # seta tipo como EMPRESA


# dispara qnd um TechLeader eh salvo
@receiver(post_save, sender=TechLeader)
def atualizar_tipo_usuario_techleader(sender, instance, **kwargs):
    usuario = instance.usuario
    if usuario.tipo_usuario != Usuario.TipoUsuario.TECHLEADER:
        usuario.tipo_usuario = Usuario.TipoUsuario.TECHLEADER
        usuario.save(update_fields=["tipo_usuario"])  # seta tipo como TECHLEADER