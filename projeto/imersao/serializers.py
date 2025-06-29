from rest_framework import serializers
from .models import (
    Iteracao, Imersao, AreaFabrica, Tecnologia, FormularioInscricao, InteresseArea,
    Palestra, Workshop, DesafioWorkshop, DiaWorkshop, ParticipacaoImersao, PresencaPalestra,
    PresencaWorkshop, DesempenhoWorkshop, InstrutorWorkshop, ParticipantesWorkshop
)
from api_rest.serializers import ParticipanteSerializer, ExtensionistaSerializer
from api_rest.models import Participante, Extensionista, Usuario
from rest_framework.response import Response
from rest_framework import status

from django.db import transaction


class IteracaoSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Iteracao
        fields = ['id', 'ano', 'semestre', 'ativa']
        
    def desativar_outras_iteracoes(self):
        iteracao_ativa = Iteracao.objects.filter(ativa=True)
        if iteracao_ativa:
            for iteracao in iteracao_ativa:
                iteracao.ativa = False
                iteracao.save()
                
    def create(self, validated_data):
        self.desativar_outras_iteracoes()
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        ativa = validated_data.get('ativa', False)
        if ativa and ativa is True:
            self.desativar_outras_iteracoes()
        return super().update(instance, validated_data)


class ImersaoSerializer(serializers.ModelSerializer):
    
    iteracao = serializers.PrimaryKeyRelatedField(
        queryset=Iteracao.objects.all(),
        required=False,
        allow_null=True,
    )
    iteracao_nome = serializers.ReadOnlyField(source='iteracao.__str__')
    ano = serializers.IntegerField(write_only=True, required=False)
    semestre = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Imersao
        fields = ['id', 'iteracao', 'iteracao_nome', 'ano', 'semestre']
        read_only_fields = ['iteracao_nome']
        extra_kwargs = {
            'iteracao': {'write_only': True} 
        }
        
        
    def validate_iteracao(self, value):
        if not value.ativa:
            raise serializers.ValidationError("Só é possível atribuir a imersão a uma iteração ativa")
        return value
    
    def validate(self, data):
        
        iteracao_obj = data.get('iteracao')
        ano = data.get('ano')
        semestre = data.get('semestre')

        if iteracao_obj:
            if ano or semestre:
                raise serializers.ValidationError("Forneça um 'iteracao' (ID) OU 'ano'/'semestre', mas não ambos.")
            if not iteracao_obj.ativa:
                raise serializers.ValidationError({"iteracao": "Só é possível atribuir a imersão a uma iteração ativa."})
            if Imersao.objects.filter(iteracao=iteracao_obj).exists():
                raise serializers.ValidationError({"iteracao": "Já existe uma imersão vinculada a essa iteração."})

        elif ano and semestre:
            if Iteracao.objects.filter(ano=ano, semestre=semestre).exists():
                raise serializers.ValidationError(f"Uma iteração para {ano}.{semestre} já existe. Use o ID da iteração existente ou .")
        
        else:
            raise serializers.ValidationError("Você deve fornecer um ID de 'iteracao' ou os campos 'ano' e 'semestre'.")
            
        return data

    def create(self, validated_data):

        ano = validated_data.get('ano')
        semestre = validated_data.get('semestre')
        
        iteracao_obj = validated_data.get('iteracao')

        if ano and semestre:
            Iteracao.objects.filter(ativa=True).update(ativa=False)
            
            iteracao_obj = Iteracao.objects.create(ano=ano, semestre=semestre, ativa=True)
        
        imersao = Imersao.objects.create(iteracao=iteracao_obj)
        return imersao
    
    #verificar necessidade de um update com logica parecida


class AreaFabricaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AreaFabrica
        fields = ['id', 'nome', 'ativa']
        

class TecnologiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tecnologia
        fields = ['id', 'nome', 'ativa']


class InteresseAreaSerializer(serializers.ModelSerializer):
    area_nome = serializers.ReadOnlyField(source='area.nome')
    
    class Meta:
        model = InteresseArea
        fields = ['id', 'area', 'area_nome', 'nivel']


class FormularioInscricaoListSerializer(serializers.ModelSerializer): # queryset = FormularioInscricao.objects.filter(imersao=<imersao_id>)
    
    usuario_id             = serializers.ReadOnlyField(source='participante.usuario.id')
    participante_nome   = serializers.ReadOnlyField(source='participante.usuario.nome')
    imersao_info        = serializers.ReadOnlyField(source='imersao.__str__')
    primeira_opcao_nome = serializers.ReadOnlyField(source='primeira_opcao.nome')
    segunda_opcao_nome  = serializers.ReadOnlyField(source='segunda_opcao.nome')
    interesses          = serializers.SerializerMethodField()

    
    class Meta:
        model = FormularioInscricao
        fields = ['id', 'usuario_id', 'participante', 'participante_nome', 'imersao', 'imersao_info', 
                'data_inscricao', 'primeira_opcao', 'primeira_opcao_nome', 
                'segunda_opcao', 'segunda_opcao_nome', 'interesses']
    
    def get_interesses(self, obj):
        return [
                {
                    "area_nome": interesse.area.nome,
                    "nivel": interesse.nivel
                }
                for interesse in obj.interesses_forms.all()
            ]


class FormularioInscricaoDetailSerializer(serializers.ModelSerializer): 
    participante    = ParticipanteSerializer(read_only=True)
    imersao         = ImersaoSerializer(read_only=True)
    primeira_opcao  = AreaFabricaSerializer(read_only=True)
    segunda_opcao   = AreaFabricaSerializer(read_only=True)
    tecnologias     = TecnologiaSerializer(many=True, read_only=True)
    interesses      = serializers.SerializerMethodField()  
    
    class Meta:
        model = FormularioInscricao
        fields = ['id', 'participante', 'imersao', 'data_inscricao', 
                'tecnologias', 'primeira_opcao', 'segunda_opcao', 'interesses']
    
    def get_interesses(self, obj):
        return [
                {
                    "area_nome": interesse.area.nome,
                    "nivel": interesse.nivel
                }
                for interesse in obj.interesses_forms.all()
            ]


class FormularioInscricaoCreateUpdateSerializer(serializers.ModelSerializer):
    
    usuario_id = serializers.IntegerField(write_only=True, required=False)
    interesses = InteresseAreaSerializer(write_only=True, many=True, required=False)
    outras_tech = TecnologiaSerializer(write_only=True, many=True, required=False)
    
    autor = serializers.SerializerMethodField(read_only=True)
    tecnologias_info = serializers.SerializerMethodField(read_only=True)
    primeira_info = serializers.SerializerMethodField(read_only=True)
    segunda_info = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = FormularioInscricao
        fields = ['id', 'usuario_id', 'autor', 'primeira_opcao', 'primeira_info', 'segunda_opcao', 'segunda_info', 'tecnologias', 'tecnologias_info', 'interesses', 'outras_tech']

    def get_usuario_id(self, obj):
        return obj.participante.usuario.id
    
    def get_autor(self, obj):
        return obj.participante.usuario.nome
    
    def get_primeira_info(self, obj): return obj.primeira_opcao.nome
    
    def get_segunda_info(self, obj): return obj.segunda_opcao.nome
    
    def get_tecnologias_info(self, obj):
        
        resultado = []
        
        # for tecnologia in obj.interesses_forms.all():
        for tecnologia in obj.tecnologias.all():
            
            resultado.append({
                'nome': tecnologia.nome
            })
        
        return resultado
    
    def validate(self, data):
        # import pprint
        # pprint.pprint(data)
        request = self.context['request']
        usuario = request.user

        if request.user.is_staff:
            usuario_id = data.get('usuario_id')
            if not usuario_id:
                raise serializers.ValidationError("Campo 'usuario_id' é obrigatório para admins.")
            try:
                participante = Participante.objects.get(usuario__id=usuario_id)
            except Participante.DoesNotExist:
                raise serializers.ValidationError("Usuário informado não é um participante.")
        else:
            try:
                participante = usuario.participante
            except Participante.DoesNotExist:
                raise serializers.ValidationError("Usuário não é um participante.")

        imersao = data.get("imersao") or Imersao.objects.filter(iteracao__ativa=True).first()
        if not imersao:
            raise serializers.ValidationError("Nenhuma imersão ativa encontrada.")

        if FormularioInscricao.objects.filter(participante=participante, imersao=imersao).exclude(id=self.instance.id if self.instance else None).exists():
            raise serializers.ValidationError("Este participante já preencheu este formulário.")

        if data.get('primeira_opcao') == data.get('segunda_opcao'):
            raise serializers.ValidationError("Primeira e segunda opção de área não podem ser iguais.")

        return data

    def create(self, validated_data):
        request = self.context['request']
        usuario = request.user

        participante = usuario.participante
        imersao = validated_data.get("imersao") or  Imersao.objects.filter(iteracao__ativa=True).first()
        if not imersao:
            raise serializers.ValidationError("Nenhuma imersão ativa encontrada.")

        interesses_data = validated_data.pop('interesses', [])
        tecnologias_data = validated_data.pop('tecnologias', [])
        outras_tech_data = validated_data.pop('outras_tech', [])

        formulario = FormularioInscricao.objects.create(
            participante=participante,
            imersao=imersao,
            **validated_data
        )

        for outras_tech in outras_tech_data:
            tech = Tecnologia.objects.create(
                nome=outras_tech['nome'],  
                ativa=True
            )
            tecnologias_data.append(tech.id)

        formulario.tecnologias.set(tecnologias_data)

        for interesse_data in interesses_data:
            InteresseArea.objects.create(
                formulario=formulario,
                area=interesse_data['area'],
                nivel=interesse_data['nivel']
            )
        
        return formulario
        
    def update(self, instance, validated_data):
        request = self.context['request']
        usuario = request.user

        interesses_data = validated_data.pop('interesses', None)
        tecnologias_data = validated_data.pop('tecnologias', None)
        outras_tech_data = validated_data.pop('outras_tech', None)

        for campo in ['primeira_opcao', 'segunda_opcao', 'imersao']:
            if campo in validated_data:
                setattr(instance, campo, validated_data[campo])

        if outras_tech_data:
            for outras in outras_tech_data:
                nova = Tecnologia.objects.create(nome=outras['nome'], ativa=True)
                if tecnologias_data is None:
                    tecnologias_data = []
                tecnologias_data.append(nova)

        instance.save()

        if tecnologias_data is not None:
            instance.tecnologias.set(tecnologias_data)

        if interesses_data is not None:
            instance.interesses_forms.all().delete()
            for interesse in interesses_data:
                InteresseArea.objects.create(
                    formulario=instance,
                    area=interesse['area'],
                    nivel=interesse['nivel']
                ) 

        return instance


class PalestraSerializer(serializers.ModelSerializer):
    imersao_info = serializers.ReadOnlyField(source='imersao.__str__')

    class Meta:
        model = Palestra
        fields = [
            'id', 'titulo', 'descricao', 
            'data', 'palestrante', 'sala', 'bloco',
            'imersao_info'  # Não expõe 'imersao' como input
        ]

    def validate(self, data):
        # Nenhuma validação extra aqui
        return data

    def create(self, validated_data):
        # atribui imersão ativa, igual ao FormularioInscricao
        imersao = Imersao.objects.filter(iteracao__ativa=True).first()
        if not imersao:
            raise serializers.ValidationError("Nenhuma imersão ativa encontrada.")
        
        validated_data['imersao'] = imersao
        return Palestra.objects.create(**validated_data)

    def update(self, instance, validated_data):
        imersao = instance.imersao  # mantém imersão original
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.imersao = imersao
        instance.save()
        return instance


class DiaWorkshopSerializer(serializers.ModelSerializer): # queryset = DiaWorkshop.objects.filter(workshop=<workshop_id>)
    class Meta:
        model = DiaWorkshop
        fields = ['id', 'workshop', 'data']


class InstrutorWorkshopSerializer(serializers.ModelSerializer):
    extensionista_nome = serializers.ReadOnlyField(source='extensionista.usuario.nome')
    
    class Meta:
        model = InstrutorWorkshop
        fields = ['id', 'extensionista', 'extensionista_nome']


class DesafioWorkshopSerializer(serializers.ModelSerializer):
    pass
        

class WorkshopListSerializer(serializers.ModelSerializer): # queryset = Workshop.objects.all()
    
    iteracao_info = serializers.ReadOnlyField(source='iteracao.__str__')
    dias_count = serializers.SerializerMethodField()
    instrutores = serializers.SerializerMethodField()
    
    class Meta:
        model = Workshop
        fields = ['id', 'iteracao', 'iteracao_info', 'titulo', 
                'sala', 'bloco', 'dias_count', 'instrutores']
    
    def get_dias_count(self, obj):
        return obj.dias_workshop.count()
    
    def get_instrutores(self, obj):
        instrutores = obj.instrutores_workshop.all()
        
        return [
            {
                "extensionista_id": instrutor.extensionista.id,
                "usuario_id": (instrutor.extensionista.participante.usuario.id if instrutor.extensionista.participante else instrutor.extensionista.excecao.usuario.id),
                "nome": (instrutor.extensionista.participante.usuario.nome if instrutor.extensionista.participante else instrutor.extensionista.excecao.usuario.nome)
            }
            for instrutor in instrutores
        ]


class ParticipantesWorkshopSerializer(serializers.ModelSerializer):
    participante_nome = serializers.ReadOnlyField(source='participante.usuario.nome')
    workshop_titulo = serializers.ReadOnlyField(source='workshop.titulo')
    
    class Meta:
        model = ParticipantesWorkshop
        fields = ['id', 'participante', 'participante_nome', 'workshop', 'workshop_titulo']


class WorkshopDetailSerializer(serializers.ModelSerializer): # queryset = Workshop.objects.prefetch_related('dias').get(id=<workshop_id>)
    iteracao = IteracaoSerializer(read_only=True)
    dias = serializers.SerializerMethodField()
    instrutores = serializers.SerializerMethodField()
    participantes = serializers.SerializerMethodField()
    
    class Meta:
        model = Workshop
        fields = ['id', 'iteracao', 'titulo', 'descricao',
                'sala', 'bloco', 'instrutores', 'dias', 'participantes']
    
    def get_dias(self, obj):
        return DiaWorkshopSerializer(obj.dias_workshop.all(), many=True).data
    
    def get_instrutores(self, obj):
        instrutores = obj.instrutores_workshop.all()
        return [
            {
                "extensionista_id": instrutor.extensionista.id,
                "usuario_id": (instrutor.extensionista.participante.usuario.id if instrutor.extensionista.participante else instrutor.extensionista.excecao.usuario.id),
                "nome": (instrutor.extensionista.participante.usuario.nome if instrutor.extensionista.participante else instrutor.extensionista.excecao.usuario.nome)
            }
            for instrutor in instrutores
        ]
    
    def get_participantes(self, obj):
        participantes = obj.participantes_workshop.all()
        return [
            {
                "usuario_id": participacao.participante.usuario.id,
                "nome": participacao.participante.usuario.nome
            }
            for participacao in participantes
        ]


class ParticipacaoImersaoSerializer(serializers.ModelSerializer): # queryset = ParticipacaoImersao.objects.filter(imersao=<imersao_id>)
    participante_nome = serializers.ReadOnlyField(source='participante.usuario.nome')
    imersao_info = serializers.ReadOnlyField(source='imersao.__str__')
    
    class Meta:
        model = ParticipacaoImersao
        fields = ['id', 'participante', 'participante_nome', 'imersao', 
                'imersao_info', 'data_participacao']
        

class ParticipacaoImersaoListSerializer(serializers.ModelSerializer):
    participante_nome = serializers.ReadOnlyField(source='participante.usuario.nome')
    imersao_info = serializers.ReadOnlyField(source='imersao.__str__')
    
    class Meta:
        model = ParticipacaoImersao
        fields = [
            'id', 'participante', 'participante_nome', 'imersao', 'imersao_info',
            'data_participacao'
        ]

class PresencaPalestraSerializer(serializers.ModelSerializer): # queryset = PresencaPalestra.objects.filter(palestra=<palestra_id>)
    participante_nome = serializers.ReadOnlyField(source='participante.usuario.nome')
    palestra_titulo = serializers.ReadOnlyField(source='palestra.titulo')
    
    class Meta:
        model = PresencaPalestra
        fields = ['id', 'participante', 'participante_nome', 'palestra', 
                'palestra_titulo', 'data_participacao']


class PresencaWorkshopSerializer(serializers.ModelSerializer):
    usuario_id = serializers.IntegerField(write_only=True, required=True)
    participante_nome = serializers.ReadOnlyField(source='participante.usuario.nome')
    workshop_titulo = serializers.ReadOnlyField(source='dia_workshop.workshop.titulo')
    data = serializers.ReadOnlyField(source='dia_workshop.data')

    class Meta:
        model = PresencaWorkshop
        fields = [
            'id', 'usuario_id', 'participante', 'participante_nome',
            'workshop_titulo', 'dia_workshop', 'data'
        ]
        read_only_fields = ['participante']

    def validate(self, data):
        usuario_id = data.get('usuario_id')
        dia_workshop = data.get('dia_workshop')

        try:
            participante = Participante.objects.get(usuario__id=usuario_id)
        except Participante.DoesNotExist:
            raise serializers.ValidationError("Usuário informado não está vinculado a um participante.")

        # Verifica duplicidade antes de salvar
        if PresencaWorkshop.objects.filter(participante=participante, dia_workshop=dia_workshop).exists():
            raise serializers.ValidationError("Este participante já tem presença registrada neste dia de workshop.")

        data['participante'] = participante
        return data

    def create(self, validated_data):
        validated_data.pop('usuario_id', None)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop('usuario_id', None)
        return super().update(instance, validated_data)

class PresencaWorkshopListSerializer(serializers.ModelSerializer):

    participante_nome = serializers.ReadOnlyField(source='participante.usuario.nome')
    workshop_titulo   = serializers.ReadOnlyField(source='dia_workshop.workshop.titulo')
    data_workshop     = serializers.DateField(source='dia_workshop.data', read_only=True)

    class Meta:
        model = PresencaWorkshop
        fields = [
            'id', 
            'participante_nome', 
            'workshop_titulo', 
        ]


class PresencaWorkshopDetailSerializer(serializers.ModelSerializer):

    participante = ParticipanteSerializer(read_only=True)
    dia_workshop = DiaWorkshopSerializer(read_only=True)

    class Meta:
        model = PresencaWorkshop
        fields = [
            'id', 
            'participante', 
            'dia_workshop', 
            'data_registro'
        ]


class DesempenhoWorkshopSerializer(serializers.ModelSerializer): 
    usuario_id = serializers.IntegerField(write_only=True)
    
    participante_nome = serializers.ReadOnlyField(source='participante.usuario.nome')
    workshop_titulo = serializers.ReadOnlyField(source='workshop.titulo')
    especialidade_nome = serializers.ReadOnlyField(source='especialidade.nome', default=None)
    faltas = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = DesempenhoWorkshop
        fields = [
            'id', 'usuario_id', 'participante_nome', 'workshop', 'workshop_titulo',
            'desempenho', 'comentario', 'especialidade', 'especialidade_nome',
            'aprovado', 'classificacao', 'experiencia', 'faltas','data_avaliacao'
        ]
        
        
    def get_faltas(self, obj):
        total_dias = DiaWorkshop.objects.filter(workshop=obj.workshop).count()
        total_presencas = PresencaWorkshop.objects.filter(
            participante=obj.participante,
            dia_workshop__workshop=obj.workshop
        ).count()
        return max(total_dias - total_presencas, 0)

    def validate(self, data):
        usuario_id = data.pop('usuario_id')

        try:
            participante = Participante.objects.get(usuario__id=usuario_id)
        except Participante.DoesNotExist:
            raise serializers.ValidationError("O usuário informado não possui um perfil de participante.")

        data['participante'] = participante
        return data
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['usuario_id'] = instance.participante.usuario.id if instance.participante and instance.participante.usuario else None
        from collections import OrderedDict
        # Reordenar os campos para colocar usuario_id onde quiser
        ordered = OrderedDict()
        ordered['id'] = rep.get('id')
        ordered['usuario_id'] = rep.get('usuario_id')
        ordered['participante_nome'] = rep.get('participante_nome')
        ordered['workshop'] = rep.get('workshop')
        ordered['workshop_titulo'] = rep.get('workshop_titulo')
        ordered['desempenho'] = rep.get('desempenho')
        ordered['comentario'] = rep.get('comentario')
        ordered['especialidade'] = rep.get('especialidade')
        ordered['especialidade_nome'] = rep.get('especialidade_nome')
        ordered['aprovado'] = rep.get('aprovado')
        ordered['classificacao'] = rep.get('classificacao')
        ordered['experiencia'] = rep.get('experiencia')
        ordered['faltas'] = rep.get('faltas')
        ordered['data_avaliacao'] = rep.get('data_avaliacao')

        return ordered


class WorkshopCreateUpdateSerializer(serializers.ModelSerializer):

    iteracao = serializers.PrimaryKeyRelatedField(
        queryset=Iteracao.objects.all(),
        required=False
    )

    instrutores = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        write_only=True
    )
    participantes = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        write_only=True
    )
    dias_workshop = serializers.ListField(
        child=serializers.DateTimeField(),
        required=False,
        write_only=True
    )

    instrutores_info = serializers.SerializerMethodField()
    participantes_info = serializers.SerializerMethodField()
    dias_workshop_info = serializers.SerializerMethodField()

    class Meta:
        model = Workshop
        fields = [
            'id', 'iteracao', 'area', 'titulo', 'descricao', 'sala', 'bloco',
            'dias_workshop', 'instrutores', 'participantes',
            'instrutores_info', 'participantes_info', 'dias_workshop_info'
        ]
        extra_kwargs = {
            'iteracao': {'write_only': True}
        }
        validators = []

    def validate(self, data):
        iteracao_obj = data.get('iteracao')

        if not iteracao_obj:
            iteracao_ativa = Iteracao.objects.filter(ativa=True).first()
            if iteracao_ativa:
                data['iteracao'] = iteracao_ativa
                iteracao_obj = iteracao_ativa
            else:
                raise serializers.ValidationError({"iteracao": "Nenhuma iteração foi fornecida e não há uma iteração ativa no sistema."})

        titulo = data.get('titulo')
        queryset = Workshop.objects.filter(iteracao=iteracao_obj, titulo=titulo)
        if self.instance: 
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError(
                {"titulo": f"Já existe um workshop com este título para a iteração '{iteracao_obj}'."}
            )
        
        return data

    def create(self, validated_data):
        instrutores_data = validated_data.pop('instrutores', [])
        participantes_data = validated_data.pop('participantes', [])
        dias_workshop_data = validated_data.pop('dias_workshop', [])

        
        workshop = Workshop.objects.create(**validated_data)
        try:
            for usuario_id in instrutores_data:
                extensionista = self._get_extensionista_from_usuario_id(usuario_id)
                if extensionista:
                    tmp = InstrutorWorkshop.objects.create(
                        workshop=workshop,
                        extensionista=extensionista
                    )
                    print(1,tmp)

            for usuario_id in participantes_data:
                participante = self._get_participante_from_usuario_id(usuario_id)
                if participante:
                    tmp = ParticipantesWorkshop.objects.create(
                        workshop=workshop,
                        participante=participante
                    )
                    print(2, tmp)

            for data in dias_workshop_data:
                tmp = DiaWorkshop.objects.create(
                    workshop=workshop,
                    data=data
                )
                print(3,tmp)
                
        except Exception as e:
            print("ERRO NO CREATE:", e)
            workshop.delete() 
            raise 
        print(workshop)
        
        return workshop

    def update(self, instance, validated_data):
        instrutores_data = validated_data.pop('instrutores', None)
        participantes_data = validated_data.pop('participantes', None)
        dias_workshop_data = validated_data.pop('dias_workshop', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if instrutores_data is not None:
            instance.instrutores_workshop.all().delete()
            for usuario_id in instrutores_data:
                extensionista = self._get_extensionista_from_usuario_id(usuario_id)
                if extensionista:
                    InstrutorWorkshop.objects.create(
                        workshop=instance,
                        extensionista=extensionista
                    )

        if participantes_data is not None:
            instance.participantes_workshop.all().delete()
            for usuario_id in participantes_data:
                participante = self._get_participante_from_usuario_id(usuario_id)
                if participante:
                    ParticipantesWorkshop.objects.create(
                        workshop=instance,
                        participante=participante
                    )

        if dias_workshop_data is not None:
            instance.dias_workshop.all().delete()
            for data in dias_workshop_data:
                DiaWorkshop.objects.create(
                    workshop=instance,
                    data=data
                )

        return instance
        
    def get_instrutores_info(self, obj):
        resultado = []
        print('instrutores',obj.instrutores_workshop.all())
        for instrutor in obj.instrutores_workshop.all():
            ext = instrutor.extensionista
            usuario = None
            if ext.participante and ext.participante.usuario:
                usuario = ext.participante.usuario
            elif ext.excecao and ext.excecao.usuario:
                usuario = ext.excecao.usuario
            if usuario:
                resultado.append({
                    "id": usuario.id,
                    "nome": usuario.nome
                })
        return resultado

    def get_participantes_info(self, obj):
        return [
            {
                "id": p.participante.usuario.id,
                "nome": p.participante.usuario.nome
            }
            for p in obj.participantes_workshop.all()
        ]

    def get_dias_workshop_info(self, obj):
        return [d.data.isoformat() for d in obj.dias_workshop.all()]

    def _get_extensionista_from_usuario_id(self, usuario_id):
        try:
            usuario = Usuario.objects.get(pk=usuario_id)
            participante = getattr(usuario, 'participante', None)
            excecao = getattr(usuario, 'excecao', None)
            if participante:
                return Extensionista.objects.filter(participante=participante).first()
            if excecao:
                return Extensionista.objects.filter(excecao=excecao).first()
        except Usuario.DoesNotExist:
            return None

    def _get_participante_from_usuario_id(self, usuario_id):
        try:
            usuario = Usuario.objects.get(pk=usuario_id)
            return getattr(usuario, 'participante', None)
        except Usuario.DoesNotExist:
            return None

class AtribuicaoWorkshops:
    def atribuir_participantes(self):
        # recuperar todos os formularios de inscrição a ser processados
        # encontrar workshops que correspondem as areas selecionadas
        # atribuir o participante aos workshops encontrados
        # marcar o formulario como já processado (workshop atribuído(?))
        pass


# Serializers aninhados para consultas especificas

# Serializer para listar formularios de inscricao agrupados por imersao
class FormularioInscricaoPorImersaoSerializer(serializers.ModelSerializer): # queryset = FormularioInscricao.objects.filter(imersao=<imersao_id>) 
    participante_nome   = serializers.ReadOnlyField(source='participante.usuario.nome')
    primeira_opcao_nome = serializers.ReadOnlyField(source='primeira_opcao.nome')
    segunda_opcao_nome  = serializers.ReadOnlyField(source='segunda_opcao.nome')
    interesses          = serializers.SerializerMethodField()
    tecnologias         = TecnologiaSerializer(many=True, read_only=True)
    
    class Meta:
        model = FormularioInscricao
        fields = ['id', 'participante', 'participante_nome', 'data_inscricao',
                'tecnologias', 'primeira_opcao', 'primeira_opcao_nome',
                'segunda_opcao', 'segunda_opcao_nome', 'interesses']
    
    def get_interesses(self, obj):
        return [
                {
                    "area_nome": interesse.area.nome,
                    "nivel": interesse.nivel
                }
                for interesse in obj.interesses_forms.all()
            ]


# agrupa desempenho de um participante em todos os workshops
class ParticipanteDesempenhoSerializer(serializers.Serializer): # queryset = DesempenhoWorkshop.objects.filter(participante=<participante_id>) 
    
    participante_id     = serializers.IntegerField()
    participante_nome   = serializers.CharField()
    desempenhos         = DesempenhoWorkshopSerializer(many=True)
    media_classificacao = serializers.FloatField()
    total_workshops     = serializers.IntegerField()
    areas_destaque      = serializers.ListField(child=serializers.CharField())


# estatisticas gerais de uma imersao; precisa q a view filtre os dados e passe os dados filtrados para o serializer
class EstatisticasImersaoSerializer(serializers.Serializer):    # queryset = FormularioInscricao.objects.filter(imersao=<imersao_id>)
                                                                # queryset = PresencaPalestra.objects.filter(palestra__imersao=<imersao_id>)
                                                                # queryset = PresencaWorkshop.objects.filter(dia_workshop__workshop__imersao=<imersao_id>)
    
    total_inscritos             = serializers.IntegerField()
    total_participantes         = serializers.IntegerField()
    areas_mais_populares        = serializers.ListField(child=serializers.DictField())
    tecnologias_mais_populares  = serializers.ListField(child=serializers.DictField())
    media_presenca_palestras    = serializers.FloatField()
    media_presenca_workshops    = serializers.FloatField()