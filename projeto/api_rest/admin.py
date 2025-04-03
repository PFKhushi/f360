from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario
from .forms import UsuarioCreationForm, UsuarioChangeForm

class CustomUserAdmin(UserAdmin):
    """Interface admin customizada para o modelo Usuario"""
    
    form = UsuarioChangeForm
    add_form = UsuarioCreationForm
    
    # Campos exibidos na listagem
    list_display = ('username', 'nome', 'email_institucional', 'is_staff')
    
    # Campos pesquisáveis
    search_fields = ('username', 'nome', 'cpf')
    
    # Ordenação padrão
    ordering = ('nome',)
    
    # Layout do formulário de edição
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Informações Pessoais', {
            'fields': ('nome', 'cpf', 'email_institucional', 'rgm', 'telefone', 'genero')
        }),
        ('Permissões', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Datas Importantes', {'fields': ('last_login', 'data_criacao')}),
    )
    
    # Layout do formulário de criação
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'nome', 'cpf', 'email_institucional', 'rgm', 'password1', 'password2'),
        }),
    )

admin.site.register(Usuario, CustomUserAdmin)