from django.contrib import admin
from .models import Usuarios, Experiencias

@admin.register(Usuarios)
class UsuariosAdmin(admin.ModelAdmin):
    list_display = (
        'nome', 
        'username', 
        'email_institucional', 
        'rgm', 
        'curso', 
        'cargo', 
        'setor', 
        'situacao', 
        'is_bolsista', 
        'is_estagiario', 
        'data_criacao'
    )
    list_filter = (
        'curso', 
        'cargo', 
        'setor', 
        'situacao', 
        'is_bolsista', 
        'is_estagiario'
    )
    search_fields = ('nome', 'username', 'rgm', 'email_institucional')
    ordering = ('nome', 'data_criacao')
    readonly_fields = ('data_criacao', 'data_atualizacao')

@admin.register(Experiencias)
class ExperienciasAdmin(admin.ModelAdmin):
    list_display = (
        'usuario', 
        'tecnologias', 
        'senioridade', 
        'descricao', 
        'data_criacao'
    )
    list_filter = ('tecnologias', 'senioridade')
    search_fields = ('usuario__nome', 'tecnologias', 'descricao')
    ordering = ('usuario', 'data_criacao')
    readonly_fields = ('data_criacao', 'data_atualizacao')
