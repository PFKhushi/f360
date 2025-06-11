from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from .serializers import (
    ImersaoSerializer, AreaFabricaSerializer, TecnologiaSerializer,
    FormularioInscricaoListSerializer, FormularioInscricaoDetailSerializer,
    FormularioInscricaoCreateUpdateSerializer, PalestraSerializer,
    WorkshopListSerializer, WorkshopDetailSerializer, WorkshopCreateUpdateSerializer,
    DiaWorkshopSerializer, ParticipacaoImersaoSerializer, PresencaPalestraSerializer,
    PresencaWorkshopSerializer, DesempenhoWorkshopSerializer, InstrutorWorkshopSerializer
)


# Esquemas de Erro Padrão

erro_validacao_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "erro": openapi.Schema(type=openapi.TYPE_STRING, example="Erro de validação nos dados enviados"),
        "codigo": openapi.Schema(type=openapi.TYPE_INTEGER, example=400),
        "detalhes": openapi.Schema(
            type=openapi.TYPE_OBJECT,
            additional_properties=openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(type=openapi.TYPE_STRING)
            )
        )
    }
)

erro_permissao_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "detail": openapi.Schema(type=openapi.TYPE_STRING, example="Você não tem permissão para executar esta ação.")
    }
)

erro_nao_encontrado_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "erro": openapi.Schema(type=openapi.TYPE_STRING, example="Recurso não encontrado"),
        "codigo": openapi.Schema(type=openapi.TYPE_INTEGER, example=404)
    }
)


erro_imersao_nao_encontrada_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "erro": openapi.Schema(type=openapi.TYPE_STRING, example="Imersão não encontrada"),
        "codigo": openapi.Schema(type=openapi.TYPE_INTEGER, example=404),
        "detalhes": openapi.Schema(type=openapi.TYPE_STRING, example="Nenhuma imersão encontrada com o ID fornecido")
    }
)

erro_imersao_integridade_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "erro": openapi.Schema(type=openapi.TYPE_STRING, example="Violação de integridade de dados"),
        "codigo": openapi.Schema(type=openapi.TYPE_INTEGER, example=409),
        "detalhes": openapi.Schema(
            type=openapi.TYPE_OBJECT,
            additional_properties=openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(type=openapi.TYPE_STRING)
            ),
            example={"ano_semestre": ["Já existe uma imersão com este ano e semestre"]}
        )
    }
)


# Esquemas de Sucesso (abaixo exemplificado)

success_imersao_schema = openapi.Response(
    description="Imersão criada/atualizada com sucesso",
    schema=ImersaoSerializer,
    examples={
        "application/json": {
            "sucesso": True,
            "resultado": {
                "id": 1,
                "ano": 2025,
                "semestre": 1,
                "ativa": True,
                "data_inicio": "2025-01-15"
            }
        }
    }
)

success_workshop_schema = openapi.Response(
    description="Workshop criado/atualizado com sucesso",
    schema=WorkshopDetailSerializer,
    examples={
        "application/json": {
            "sucesso": True,
            "resultado": {
                "id": 1,
                "titulo": "Workshop de Back",
                "descricao": "",
                "sala": "Lab 10",
                "bloco": "Centro de tecnologia",
                "imersao": 1,
                "dias": [
                    {"data": "2025-03-08T14:00:00Z", "conteudo": "Introdução ao Django"}
                ],
                "instrutores": [
                    {"id": 1, "nome": "Instrutor Exemplo"}
                ]
            }
        }
    }
)


# Operações para Imersão

def list_imersoes_swagger():
    return swagger_auto_schema(
        operation_description="Lista todas as imersões cadastradas no sistema.\n\n"
                            "**Filtros:**\n"
                            "- Participantes comuns só veem imersões ativas\n"
                            "- Administradores e Tech Leaders veem todas as imersões\n\n"
                            "**Ordenação padrão:** ano e semestre decrescente",
        responses={
            200: openapi.Response(
                'Lista de imersões', 
                ImersaoSerializer(many=True),
                examples={
                    "application/json": {
                        "sucesso": True,
                        "resultado": [
                            {
                                "id": 1,
                                "ano": 2025,
                                "semestre": 1,
                                "ativa": True,
                                "data_inicio": "2025-01-15"
                            },
                            {
                                "id": 2,
                                "ano": 2024,
                                "semestre": 2,
                                "ativa": False,
                                "data_inicio": "2024-07-10"
                            }
                        ],
                        "erro": "",
                        "detalhes": []
                    }
                }
            ),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Imersões']
    )

def create_imersoes_swagger():
    return swagger_auto_schema(
        operation_description="Cria uma nova imersão.\n\n"
                            "**Permissões requeridas:** Administrador\n\n"
                            "**Campos obrigatórios:**\n"
                            "- ano (4 dígitos)\n"
                            "- semestre (1 ou 2)\n\n"
                            "**Restrições:**\n"
                            "- Combinação de ano e semestre deve ser única",
        request_body=ImersaoSerializer,
        responses={
            201: openapi.Response(
                'Imersão criada com sucesso',
                ImersaoSerializer,
                examples={
                    "application/json": {
                        "sucesso": True,
                        "resultado": {
                            "id": 3,
                            "ano": 2025,
                            "semestre": 2,
                            "ativa": True,
                            "data_inicio": "2025-07-15"
                        },
                        "erro": "",
                        "detalhes": []
                    }
                }
            ),
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            403: openapi.Response('Permissão negada', erro_permissao_schema),
            409: openapi.Response('Conflito de dados', erro_imersao_integridade_schema)
        },
        tags=['Imersões']
)
# Operações para Workshop

def list_workshops_swagger():
    return swagger_auto_schema(
        operation_description="Lista todos os workshops cadastrados. "
                             "Filtrados por imersão se o parâmetro 'imersao_id' for fornecido.",
        manual_parameters=[
            openapi.Parameter(
                'imersao_id',
                openapi.IN_QUERY,
                description="ID da imersão para filtrar workshops",
                type=openapi.TYPE_INTEGER
            )
        ],
        responses={
            200: openapi.Response('Lista de workshops', WorkshopListSerializer(many=True)),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Workshops']
    )

def create_workshop_swagger():
    return swagger_auto_schema(
        operation_description="Cria um novo workshop. Requer permissão de administrador.",
        request_body=WorkshopCreateUpdateSerializer,
        responses={
            201: success_workshop_schema,
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            403: openapi.Response('Permissão negada', erro_permissao_schema)
        },
        tags=['Workshops']
    )


# Operações para Formulário de Inscrição

def create_formulario_inscricao_swagger():
    return swagger_auto_schema(
        operation_description="Cria um novo formulário de inscrição para uma imersão. "
                             "Campos obrigatórios: participante_id, imersao_id, primeira_opcao_id, segunda_opcao_id.",
        request_body=FormularioInscricaoCreateUpdateSerializer,
        responses={
            201: openapi.Response('Formulário criado', FormularioInscricaoDetailSerializer),
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            403: openapi.Response('Permissão negada', erro_permissao_schema),
            404: openapi.Response('Imersão ou participante não encontrado', erro_nao_encontrado_schema)
        },
        tags=['Formulários']
    )


# Operações para Presença

def registrar_presenca_workshop_swagger():
    return swagger_auto_schema(
        operation_description="Registra presença de um participante em um dia de workshop.",
        request_body=PresencaWorkshopSerializer,
        responses={
            201: openapi.Response('Presença registrada', PresencaWorkshopSerializer),
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            403: openapi.Response('Permissão negada', erro_permissao_schema),
            404: openapi.Response('Workshop ou participante não encontrado', erro_nao_encontrado_schema)
        },
        tags=['Presenças']
    )


# Operações para Desempenho

def avaliar_desempenho_swagger():
    return swagger_auto_schema(
        operation_description="Avalia o desempenho de um participante em um workshop. "
                             "Requer permissão de Tech Leader ou administrador.",
        request_body=DesempenhoWorkshopSerializer,
        responses={
            201: openapi.Response('Desempenho registrado', DesempenhoWorkshopSerializer),
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            403: openapi.Response('Permissão negada', erro_permissao_schema)
        },
        tags=['Desempenho']
    )