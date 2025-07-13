from rest_framework import serializers
from .models import Projeto, MembroEquipe
from django.db import transaction
from api_rest.serializers import ExtensionistaSerializer, TechLeaderSerializer, EmpresaSerializer
from api_rest.models import Extensionista, Empresa, TechLeader, Usuario
from imersao.models import AreaFabrica


class ProjetoSerializer(serializers.ModelSerializer):
    techleader_usuario_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    empresa_usuario_id = serializers.IntegerField(write_only=True, required=True)
    equipe = serializers.ListField(
        child=serializers.DictField(), write_only=True, required=False
    )

    techleader_info = serializers.SerializerMethodField()
    empresa_info = serializers.SerializerMethodField()
    equipe_info = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    etapa_atual_display = serializers.CharField(source='get_etapa_atual_display', read_only=True)
    
    class Meta:
        model = Projeto
        fields = [
            'id', 'nome', 'descricao', 'area', 'data_prazo', 'data_entrega',
            'status', 'etapa_atual', 'progresso', 'observacoes',
            'techleader_usuario_id', 'empresa_usuario_id', 'equipe',
            'techleader_info', 'empresa_info', 'equipe_info',
            'status_display', 'etapa_atual_display'
        ]

    def get_techleader_info(self, obj):
        if obj.techleader and hasattr(obj.techleader, 'usuario'):
            return {'id': obj.techleader.usuario.id, 'nome': obj.techleader.usuario.nome}
        return None

    def get_empresa_info(self, obj):
        if obj.empresa and hasattr(obj.empresa, 'usuario'):
            return {'id': obj.empresa.usuario.id, 'nome': obj.empresa.usuario.nome}
        return None

    def get_equipe_info(self, obj):
        
        resultado = []
        for membro in obj.membros.all():
            extensionista = membro.extensionista
            
            if not extensionista:
                continue

            participante = getattr(extensionista, 'participante', None)
            excecao = getattr(extensionista, 'excecao', None)
            
            usuario = None
            if participante:
                usuario = getattr(participante, 'usuario', None)
            elif excecao:
                usuario = getattr(excecao, 'usuario', None)

            if usuario:
                cargos_data = [{'id': c.id, 'nome': c.nome} for c in membro.cargo.all()]
                resultado.append({
                    'membro_equipe_id': membro.id,
                    'usuario_id': usuario.id,
                    'nome': usuario.nome,
                    'cargos': cargos_data,
                    'status': membro.get_status_display()
                })
        return resultado
    
    def _get_techleader_from_usuario_id(self, usuario_id):
        try:
            return TechLeader.objects.get(usuario_id=usuario_id)
        except TechLeader.DoesNotExist:
            return None
            
    def _get_empresa_from_usuario_id(self, usuario_id):
        try:
            return Empresa.objects.get(usuario_id=usuario_id)
        except Empresa.DoesNotExist:
            return None

    def _get_extensionista_from_usuario_id(self, usuario_id):
        try:
            usuario = Usuario.objects.get(pk=usuario_id)
            if hasattr(usuario, 'participante'):
                return Extensionista.objects.filter(participante=usuario.participante).first()
            if hasattr(usuario, 'excecao'):
                return Extensionista.objects.filter(excecao=usuario.excecao).first()
        except Usuario.DoesNotExist:
            return None
        return None

    def validate_equipe(self, equipe_data):
        for i, membro in enumerate(equipe_data):
            if not membro.get('usuario_id'):
                raise serializers.ValidationError({f"equipe[{i}]": "O campo 'usuario_id' é obrigatório."})
            
            cargos_ids = membro.get('cargos_ids')
            if not cargos_ids or not isinstance(cargos_ids, list):
                raise serializers.ValidationError({f"equipe[{i}]": "O campo 'cargos_ids' é obrigatório e deve ser uma lista de IDs."})

            for cargo_id in cargos_ids:
                if not AreaFabrica.objects.filter(pk=cargo_id).exists():
                    raise serializers.ValidationError({f"equipe[{i}]": f"O cargo com ID {cargo_id} não existe."})

        return equipe_data

    @transaction.atomic
    def create(self, validated_data):
        techleader_usuario_id = validated_data.pop('techleader_usuario_id', None)
        empresa_usuario_id = validated_data.pop('empresa_usuario_id', None)
        equipe_data = validated_data.pop('equipe', [])

        techleader = self._get_techleader_from_usuario_id(techleader_usuario_id) if techleader_usuario_id else None
        empresa = self._get_empresa_from_usuario_id(empresa_usuario_id)
        
        if not empresa:
            raise serializers.ValidationError({"empresa_usuario_id": f"Nenhum perfil de Empresa encontrado para o usuário com ID {empresa_usuario_id}."})
        if techleader_usuario_id and not techleader:
            raise serializers.ValidationError({"techleader_usuario_id": f"Nenhum perfil de Tech Leader encontrado para o usuário com ID {techleader_usuario_id}."})

        validated_data['techleader'] = techleader
        validated_data['empresa'] = empresa
        
        projeto = Projeto.objects.create(**validated_data)

        for membro_data in equipe_data:
            usuario_id = membro_data.get('usuario_id')
            cargos_ids = membro_data.get('cargos_ids')
            
            if usuario_id and cargos_ids:
                extensionista = self._get_extensionista_from_usuario_id(usuario_id)
                if extensionista:
                    membro_criado = MembroEquipe.objects.create(
                        projeto=projeto,
                        extensionista=extensionista,
                        status=membro_data.get('status', MembroEquipe.StatusMembro.ATIVO)
                    )
                    membro_criado.cargo.set(cargos_ids)
        
        return projeto

    @transaction.atomic
    def update(self, instance, validated_data):
        techleader_usuario_id = validated_data.pop('techleader_usuario_id', None)
        empresa_usuario_id = validated_data.pop('empresa_usuario_id', None)
        equipe_data = validated_data.pop('equipe', None)

        if 'techleader_usuario_id' in self.initial_data:
            techleader = self._get_techleader_from_usuario_id(techleader_usuario_id)
            if techleader_usuario_id and not techleader:
                raise serializers.ValidationError({"techleader_usuario_id": f"Nenhum perfil de Tech Leader encontrado para o usuário com ID {techleader_usuario_id}."})
            instance.techleader = techleader

        if 'empresa_usuario_id' in self.initial_data:
            empresa = self._get_empresa_from_usuario_id(empresa_usuario_id)
            if not empresa:
                raise serializers.ValidationError({"empresa_usuario_id": f"Nenhum perfil de Empresa encontrado para o usuário com ID {empresa_usuario_id}."})
            instance.empresa = empresa
        
        instance = super().update(instance, validated_data)

        if equipe_data is not None:
            instance.membros.all().delete()
            for membro_data in equipe_data:
                usuario_id = membro_data.get('usuario_id')
                cargos_ids = membro_data.get('cargos_ids')

                if usuario_id and cargos_ids:
                    extensionista = self._get_extensionista_from_usuario_id(usuario_id)
                    if extensionista:
                        membro_criado = MembroEquipe.objects.create(
                            projeto=instance,
                            extensionista=extensionista,
                            status=membro_data.get('status', MembroEquipe.StatusMembro.ATIVO)
                        )
                        membro_criado.cargo.set(cargos_ids)

        return instance
    
class ProjetoListSerializer(serializers.ModelSerializer):
    
    techleader_info = serializers.SerializerMethodField()
    empresa_info = serializers.SerializerMethodField()
    equipe_info = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    etapa_atual_display = serializers.CharField(source='get_etapa_atual_display', read_only=True)
    area_info = serializers.StringRelatedField(source='area', read_only=True)
    class Meta:
        model = Projeto
        fields = ['id', 'nome', 'techleader_info', 'empresa_info', 'equipe_info', 'area_info', 'status', 'status_display', 'etapa_atual_display', 'progresso']
        
    def get_techleader_info(self, obj):
        if obj.techleader and hasattr(obj.techleader, 'usuario'):
            return {'id': obj.techleader.id, 'nome': obj.techleader.usuario.nome}
        return None

    def get_empresa_info(self, obj):
        if obj.empresa and hasattr(obj.empresa, 'usuario'):
            return {'id': obj.empresa.id, 'nome': obj.empresa.usuario.nome}
        return None
    
    def get_equipe_info(self, obj):
        
        resultado = []
        for membro in obj.membros.all():
            extensionista = membro.extensionista
            
            if not extensionista:
                continue

            participante = getattr(extensionista, 'participante', None)
            excecao = getattr(extensionista, 'excecao', None)
            
            usuario = None
            if participante:
                usuario = getattr(participante, 'usuario', None)
            elif excecao:
                usuario = getattr(excecao, 'usuario', None)

            if usuario:
                cargos_data = [{'id': c.id, 'nome': c.nome} for c in membro.cargo.all()]
                resultado.append({
                    'membro_equipe_id': membro.id,
                    'usuario_id': usuario.id,
                    'nome': usuario.nome,
                    'cargos': cargos_data,
                    'status': membro.get_status_display()
                })
        return resultado

class ProjetoBasicSerializer(serializers.ModelSerializer):
    
    techleader_info = serializers.SerializerMethodField()
    empresa_info = serializers.SerializerMethodField()
    equipe_info = serializers.SerializerMethodField()
    area_info = serializers.StringRelatedField(source='area', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    etapa_atual_display = serializers.CharField(source='get_etapa_atual_display', read_only=True)
    
    class Meta:
        model = Projeto
        fields = [
            'id', 'nome', 'descricao', 'status', 'status_display', 'etapa_atual', 'etapa_atual_display', 
            'progresso', 'techleader_info', 'empresa_info', 'equipe_info', 
            'area_info' 
        ]

    def get_techleader_info(self, obj):
        if obj.techleader and hasattr(obj.techleader, 'usuario'):
            return {'nome': obj.techleader.usuario.nome}
        return None

    def get_empresa_info(self, obj):
        if obj.empresa and hasattr(obj.empresa, 'usuario'):
            return {'nome': obj.empresa.usuario.nome}
        return None
    
    def get_equipe_info(self, obj):
        
        resultado = []
        for membro in obj.membros.all():
            extensionista = membro.extensionista
            
            if not extensionista:
                continue

            participante = getattr(extensionista, 'participante', None)
            excecao = getattr(extensionista, 'excecao', None)
            
            usuario = None
            if participante:
                usuario = getattr(participante, 'usuario', None)
            elif excecao:
                usuario = getattr(excecao, 'usuario', None)

            if usuario:
                cargos_data = [{'id': c.id, 'nome': c.nome} for c in membro.cargo.all()]
                resultado.append({
                    'membro_equipe_id': membro.id,
                    'usuario_id': usuario.id,
                    'nome': usuario.nome,
                    'cargos': cargos_data,
                    'status': membro.get_status_display()
                })
        return resultado