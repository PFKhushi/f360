from rest_framework import serializers
from .models import (
    Imersao, AreaFabrica, Tecnologia, FormularioInscricao, InteresseArea,
    Palestra, Workshop, DiaWorkshop, ParticipacaoImersao, PresencaPalestra,
    PresencaWorkshop, DesempenhoWorkshop
)
from api_rest.serializers import ParticipanteSerializer


class ImersaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Imersao
        fields = '__all__'


class AreaFabricaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AreaFabrica
        fields = '__all__'


class TecnologiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tecnologia
        fields = '__all__'


class InteresseAreaSerializer(serializers.ModelSerializer):
    area_nome = serializers.ReadOnlyField(source='area.nome')
    
    class Meta:
        model = InteresseArea
        fields = ['id', 'area', 'area_nome', 'nivel']


class FormularioInscricaoListSerializer(serializers.ModelSerializer): # queryset = FormularioInscricao.objects.filter(imersao=<imersao_id>)
    participante_nome   = serializers.ReadOnlyField(source='participante.nome')
    imersao_info        = serializers.ReadOnlyField(source='imersao.__str__')
    primeira_opcao_nome = serializers.ReadOnlyField(source='primeira_opcao.nome')
    segunda_opcao_nome  = serializers.ReadOnlyField(source='segunda_opcao.nome')
    
    class Meta:
        model = FormularioInscricao
        fields = ['id', 'participante', 'participante_nome', 'imersao', 'imersao_info', 
                'data_inscricao', 'primeira_opcao', 'primeira_opcao_nome', 
                'segunda_opcao', 'segunda_opcao_nome']


class FormularioInscricaoDetailSerializer(serializers.ModelSerializer): # queryset = FormularioInscricao.objects.prefetch_related('tecnologias', 'interesses').get(id=<formulario_id>)
    participante    = ParticipanteSerializer(read_only=True)
    imersao         = ImersaoSerializer(read_only=True)
    primeira_opcao  = AreaFabricaSerializer(read_only=True)
    segunda_opcao   = AreaFabricaSerializer(read_only=True)
    tecnologias     = TecnologiaSerializer(many=True, read_only=True)
    interesses      = InteresseAreaSerializer(many=True, read_only=True)
    
    class Meta:
        model = FormularioInscricao
        fields = ['id', 'participante', 'imersao', 'data_inscricao', 
                'tecnologias', 'primeira_opcao', 'segunda_opcao', 'interesses']


class FormularioInscricaoCreateUpdateSerializer(serializers.ModelSerializer):
    interesses = InteresseAreaSerializer(many=True, required=False)
    
    class Meta:
        model = FormularioInscricao
        fields = ['participante', 'imersao', 'tecnologias', 'primeira_opcao', 
                'segunda_opcao', 'interesses']
    
    def validate(self, data):
        participante = data['participante']
        imersao = data['imersao']
        
        if FormularioInscricao.objects.filter(participante=participante, imersao=imersao).exists():
            raise serializers.ValidationError("Este participante já está inscrito nessa imersão.")
        
        if data.get('primeira_opcao') == data.get('segunda_opcao'):
            raise serializers.ValidationError("Primeira e segunda opção de área não podem ser iguais.")
        
        return data  
    
    def create(self, validated_data):
        interesses_data = validated_data.pop('interesses', [])
        tecnologias_data = validated_data.pop('tecnologias', [])
        
        formulario = FormularioInscricao.objects.create(**validated_data)
        
        formulario.tecnologias.set(tecnologias_data)
        
        for interesse_data in interesses_data:
            InteresseArea.objects.create(
                formulario=formulario,
                area=interesse_data['area'],
                nivel=interesse_data['nivel']
            )
        
        return formulario
    
    def update(self, instance, validated_data):
        interesses_data = validated_data.pop('interesses', [])
        tecnologias_data = validated_data.pop('tecnologias', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if tecnologias_data is not None:
            instance.tecnologias.set(tecnologias_data)

        if interesses_data:
            
            novas_areas = {item['area'].id: item for item in interesses_data}
            interesses_existentes = {i.area.id: i for i in instance.interesses.all()}

            for area_id, interesse_data in novas_areas.items():
                if area_id in interesses_existentes:
                    interesse = interesses_existentes[area_id]
                    interesse.nivel = interesse_data['nivel']
                    interesse.save()
                else:
                    InteresseArea.objects.create(
                        formulario=instance,
                        area=interesse_data['area'],
                        nivel=interesse_data['nivel']
                    )

            # eemove interesses n enviados
            for area_id in set(interesses_existentes) - set(novas_areas):
                interesses_existentes[area_id].delete()

        return instance


class PalestraSerializer(serializers.ModelSerializer): # queryset = Palestra.objects.filter(imersao=<imersao_id>)
    imersao_info = serializers.ReadOnlyField(source='imersao.__str__')
    
    class Meta:
        model = Palestra
        fields = ['id', 'imersao', 'imersao_info', 'titulo', 'descricao', 
                'data', 'palestrante', 'sala', 'bloco']


class DiaWorkshopSerializer(serializers.ModelSerializer): # queryset = DiaWorkshop.objects.filter(workshop=<workshop_id>)
    class Meta:
        model = DiaWorkshop
        fields = ['id', 'workshop', 'data', 'conteudo']


class WorkshopListSerializer(serializers.ModelSerializer): # queryset = Workshop.objects.all()
    imersao_info    = serializers.ReadOnlyField(source='imersao.__str__')
    dias_count      = serializers.SerializerMethodField()
    
    class Meta:
        model = Workshop
        fields = ['id', 'imersao', 'imersao_info', 'titulo', 'instrutor', 
                'sala', 'bloco', 'dias_count']
    
    def get_dias_count(self, obj):
        return obj.dias.count()


class WorkshopDetailSerializer(serializers.ModelSerializer): # queryset = Workshop.objects.prefetch_related('dias').get(id=<workshop_id>)
    imersao = ImersaoSerializer(read_only=True)
    dias    = DiaWorkshopSerializer(many=True, read_only=True)
    
    class Meta:
        model = Workshop
        fields = ['id', 'imersao', 'titulo', 'descricao', 'instrutor', 
                'sala', 'bloco', 'dias']


class ParticipacaoImersaoSerializer(serializers.ModelSerializer): # queryset = ParticipacaoImersao.objects.filter(imersao=<imersao_id>)
    participante_nome   = serializers.ReadOnlyField(source='participante.nome')
    imersao_info        = serializers.ReadOnlyField(source='imersao.__str__')
    
    class Meta:
        model = ParticipacaoImersao
        fields = ['id', 'participante', 'participante_nome', 'imersao', 
                'imersao_info', 'data_participacao']


class PresencaPalestraSerializer(serializers.ModelSerializer): # queryset = PresencaPalestra.objects.filter(palestra=<palestra_id>)
    participante_nome   = serializers.ReadOnlyField(source='participante.nome')
    palestra_titulo     = serializers.ReadOnlyField(source='palestra.titulo')
    
    class Meta:
        model = PresencaPalestra
        fields = ['id', 'participante', 'participante_nome', 'palestra', 
                'palestra_titulo', 'data_participacao']


class PresencaWorkshopSerializer(serializers.ModelSerializer): # queryset = PresencaWorkshop.objects.filter(dia_workshop__workshop=<workshop_id>)
    participante_nome   = serializers.ReadOnlyField(source='participante.nome')
    workshop_titulo     = serializers.ReadOnlyField(source='dia_workshop.workshop.titulo')
    data_workshop       = serializers.ReadOnlyField(source='dia_workshop.data')
    conteudo            = serializers.ReadOnlyField(source='dia_workshop.conteudo')
    
    class Meta:
        model = PresencaWorkshop
        fields = ['id', 'participante', 'participante_nome', 'dia_workshop', 
                'workshop_titulo', 'data_workshop', 'conteudo', 'data_registro']


class DesempenhoWorkshopSerializer(serializers.ModelSerializer): # queryset = DesempenhoWorkshop.objects.filter(workshop=<workshop_id>)
    participante_nome   = serializers.ReadOnlyField(source='participante.nome')
    workshop_titulo     = serializers.ReadOnlyField(source='workshop.titulo')
    especialidade_nome  = serializers.ReadOnlyField(source='especialidade.nome', default=None)
    
    class Meta:
        model = DesempenhoWorkshop
        fields = ['id', 'participante', 'participante_nome', 'workshop', 
                'workshop_titulo', 'desempenho', 'comentario', 'especialidade', 
                'especialidade_nome', 'classificacao', 'experiencia', 'data_avaliacao']


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
    participante_nome   = serializers.ReadOnlyField(source='participante.nome')
    primeira_opcao_nome = serializers.ReadOnlyField(source='primeira_opcao.nome')
    segunda_opcao_nome  = serializers.ReadOnlyField(source='segunda_opcao.nome')
    interesses          = InteresseAreaSerializer(many=True, read_only=True)
    tecnologias         = TecnologiaSerializer(many=True, read_only=True)
    
    class Meta:
        model = FormularioInscricao
        fields = ['id', 'participante', 'participante_nome', 'data_inscricao',
                'tecnologias', 'primeira_opcao', 'primeira_opcao_nome',
                'segunda_opcao', 'segunda_opcao_nome', 'interesses']


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