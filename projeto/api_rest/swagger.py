from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from .serializers import ParticipanteSerializer, TechLeaderSerializer, EmpresaSerializer

# Esquemas de erro padrão
erro_validacao_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "erro": openapi.Schema(type=openapi.TYPE_STRING, example="Erro de validação nos dados enviados"),
        "codigo": openapi.Schema(type=openapi.TYPE_INTEGER, example=400),
        "detalhes": openapi.Schema(
            type=openapi.TYPE_OBJECT,
            additional_properties=openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(type=openapi.TYPE_STRING))
        )
    }
)

erro_participante_nao_encontrado_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "erro": openapi.Schema(type=openapi.TYPE_STRING, example="Recurso não encontrado"),
        "codigo": openapi.Schema(type=openapi.TYPE_INTEGER, example=404),
        "detalhes": openapi.Schema(type=openapi.TYPE_STRING, example="Participante não encontrado com o ID fornecido.")
    }
)
erro_techleader_nao_encontrado_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "erro": openapi.Schema(type=openapi.TYPE_STRING, example="Recurso não encontrado"),
        "codigo": openapi.Schema(type=openapi.TYPE_INTEGER, example=404),
        "detalhes": openapi.Schema(type=openapi.TYPE_STRING, example="Tech Leader não encontrado com o ID fornecido.")
    }
)
erro_empresa_nao_encontrado_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "erro": openapi.Schema(type=openapi.TYPE_STRING, example="Recurso não encontrado"),
        "codigo": openapi.Schema(type=openapi.TYPE_INTEGER, example=404),
        "detalhes": openapi.Schema(type=openapi.TYPE_STRING, example="Empresa não encontrado com o ID fornecido.")
    }
)

erro_permissao_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "detail": openapi.Schema(type=openapi.TYPE_STRING, example="Você não tem permissão para executar esta ação.")
    }
)

erro_participante_integridade_schema = openapi.Schema(
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
            example={"cpf": ["Este CPF já está cadastrado"]}
        )
    }
)
erro_techleader_integridade_schema = openapi.Schema(
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
            example={"codigo": ["Este código já está cadastrado"]}
        )
    }
)

erro_empresa_integridade_schema = openapi.Schema(
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
            example={"usuario": ["Já existe um usuário com esse username"]}
        )
    }
)

# Esquemas de sucesso
success_participante_schema = ParticipanteSerializer()
success_techleader_schema = TechLeaderSerializer()
success_empresa_schema = EmpresaSerializer()

# PARTICIPANTE
def list_participantes_swagger():
    return swagger_auto_schema(
        operation_description="Lista todos os participantes",
        responses={
            200: openapi.Response('Lista de participantes', ParticipanteSerializer(many=True)),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Participantes']
    )

def create_participantes_swagger():
    return swagger_auto_schema(
        operation_description="Cria um novo participante",
        request_body=ParticipanteSerializer,
        responses={
            201: openapi.Response('Participante criado', ParticipanteSerializer()),
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            409: openapi.Response('Conflito de dados', erro_participante_integridade_schema)
        },
        tags=['Participantes']
    )

def retrieve_participantes_swagger():
    return swagger_auto_schema(
        operation_description="Obtém detalhes de um participante",
        responses={
            200: openapi.Response('Detalhes do participante', ParticipanteSerializer()),
            404: openapi.Response('Não encontrado', erro_participante_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Participantes']
    )

def update_participantes_swagger():
    return swagger_auto_schema(
        operation_description="Atualiza todos os dados de um participante",
        request_body=ParticipanteSerializer,
        responses={
            200: openapi.Response('Participante atualizado', ParticipanteSerializer()),
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            404: openapi.Response('Não encontrado', erro_participante_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema),
            409: openapi.Response('Conflito de dados', erro_participante_integridade_schema)
        },
        tags=['Participantes']
    )

def partial_update_participantes_swagger():
    return swagger_auto_schema(
        operation_description="Atualiza parcialmente um participante",
        request_body=ParticipanteSerializer,
        responses={
            200: openapi.Response('Participante atualizado parcialmente', ParticipanteSerializer()),
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            404: openapi.Response('Não encontrado', erro_participante_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema),
            409: openapi.Response('Conflito de dados', erro_participante_integridade_schema)
        },
        tags=['Participantes']
    )

def delete_participantes_swagger():
    return swagger_auto_schema(
        operation_description="Exclui um participante",
        responses={
            204: "Participante excluído com sucesso",
            404: openapi.Response('Não encontrado', erro_participante_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Participantes']
    )

# TECHLEADER
def list_techleaders_swagger():
    return swagger_auto_schema(
        operation_description="Lista todos os tech leaders",
        responses={
            200: openapi.Response('Lista de tech leaders', TechLeaderSerializer(many=True)),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Tech Leaders']
    )

def create_techleaders_swagger():
    return swagger_auto_schema(
        operation_description="Cria um novo tech leader",
        request_body=TechLeaderSerializer,
        responses={
            201: openapi.Response('Tech leader criado', TechLeaderSerializer()),
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            409: openapi.Response('Conflito de dados', erro_techleader_integridade_schema)
        },
        tags=['Tech Leaders']
    )

def retrieve_techleaders_swagger():
    return swagger_auto_schema(
        operation_description="Obtém detalhes de um tech leader",
        responses={
            200: openapi.Response('Detalhes do tech leader', TechLeaderSerializer()),
            404: openapi.Response('Não encontrado', erro_techleader_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Tech Leaders']
    )

def update_techleaders_swagger():
    return swagger_auto_schema(
        operation_description="Atualiza todos os dados de um tech leader",
        request_body=TechLeaderSerializer,
        responses={
            200: openapi.Response('Tech leader atualizado', TechLeaderSerializer()),
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            404: openapi.Response('Não encontrado', erro_techleader_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema),
            409: openapi.Response('Conflito de dados', erro_techleader_integridade_schema)
        },
        tags=['Tech Leaders']
    )

def partial_update_techleaders_swagger():
    return swagger_auto_schema(
        operation_description="Atualiza parcialmente um tech leader",
        request_body=TechLeaderSerializer,
        responses={
            200: openapi.Response('Tech leader atualizado parcialmente', TechLeaderSerializer()),
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            404: openapi.Response('Não encontrado', erro_techleader_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema),
            409: openapi.Response('Conflito de dados', erro_techleader_integridade_schema)
        },
        tags=['Tech Leaders']
    )

def delete_techleaders_swagger():
    return swagger_auto_schema(
        operation_description="Exclui um tech leader",
        responses={
            204: "Tech leader excluído com sucesso",
            404: openapi.Response('Não encontrado', erro_techleader_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Tech Leaders']
    )

# EMPRESA
def list_empresas_swagger():
    return swagger_auto_schema(
        operation_description="Lista todas as empresas",
        responses={
            200: openapi.Response('Lista de empresas', EmpresaSerializer(many=True)),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Empresas']
    )

def create_empresas_swagger():
    return swagger_auto_schema(
        operation_description="Cria uma nova empresa",
        request_body=EmpresaSerializer,
        responses={
            201: openapi.Response('Empresa criada', EmpresaSerializer()),
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            409: openapi.Response('Conflito de dados', erro_empresa_integridade_schema)
        },
        tags=['Empresas']
    )

def retrieve_empresas_swagger():
    return swagger_auto_schema(
        operation_description="Obtém detalhes de uma empresa",
        responses={
            200: openapi.Response('Detalhes da empresa', EmpresaSerializer()),
            404: openapi.Response('Não encontrado', erro_empresa_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Empresas']
    )

def update_empresas_swagger():
    return swagger_auto_schema(
        operation_description="Atualiza todos os dados de uma empresa",
        request_body=EmpresaSerializer,
        responses={
            200: openapi.Response('Empresa atualizada', EmpresaSerializer()),
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            404: openapi.Response('Não encontrado', erro_empresa_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema),
            409: openapi.Response('Conflito de dados', erro_empresa_integridade_schema)
        },
        tags=['Empresas']
    )

def partial_update_empresas_swagger():
    return swagger_auto_schema(
        operation_description="Atualiza parcialmente uma empresa",
        request_body=EmpresaSerializer,
        responses={
            200: openapi.Response('Empresa atualizada parcialmente', EmpresaSerializer()),
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            404: openapi.Response('Não encontrado', erro_empresa_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema),
            409: openapi.Response('Conflito de dados', erro_empresa_integridade_schema)
        },
        tags=['Empresas']
    )

def delete_empresas_swagger():
    return swagger_auto_schema(
        operation_description="Exclui uma empresa",
        responses={
            204: "Empresa excluída com sucesso",
            404: openapi.Response('Não encontrado', erro_empresa_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Empresas']
    )
