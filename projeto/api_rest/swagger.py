from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from .serializers import ParticipanteSerializer, TechLeaderSerializer, EmpresaSerializer, ExcecaoSerializer, ExtensionistaSerializer, CustomTokenSerializer, AdminCreateSerializer
from rest_framework import serializers

# Esquemas de erro de validação
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

#Erro de participante não encontrado
erro_participante_nao_encontrado_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "erro": openapi.Schema(type=openapi.TYPE_STRING, example="Recurso não encontrado"),
        "codigo": openapi.Schema(type=openapi.TYPE_INTEGER, example=404),
        "detalhes": openapi.Schema(type=openapi.TYPE_STRING, example="Participante não encontrado com o ID fornecido.")
    }
)

#Erro de techlearder não encontrado
erro_techleader_nao_encontrado_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "erro": openapi.Schema(type=openapi.TYPE_STRING, example="Recurso não encontrado"),
        "codigo": openapi.Schema(type=openapi.TYPE_INTEGER, example=404),
        "detalhes": openapi.Schema(type=openapi.TYPE_STRING, example="Tech Leader não encontrado com o ID fornecido.")
    }
)

#Erro de empresa não encontrada
erro_empresa_nao_encontrado_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "erro": openapi.Schema(type=openapi.TYPE_STRING, example="Recurso não encontrado"),
        "codigo": openapi.Schema(type=openapi.TYPE_INTEGER, example=404),
        "detalhes": openapi.Schema(type=openapi.TYPE_STRING, example="Empresa não encontrada com o ID fornecido.")
    }
)


#Exceções/exceção não encontrada
erro_excecao_nao_encontrado_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "erro": openapi.Schema(type=openapi.TYPE_STRING, example="Recurso não encontrado"),
        "codigo": openapi.Schema(type=openapi.TYPE_INTEGER, example=404),
        "detalhes": openapi.Schema(type=openapi.TYPE_STRING, example="Exceção não encontrada com o ID fornecido.")
    }
)

#Erro de extensionista não encontrado
erro_extensionista_nao_encontrado_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "erro": openapi.Schema(type=openapi.TYPE_STRING, example="Recurso não encontrado"),
        "codigo": openapi.Schema(type=openapi.TYPE_INTEGER, example=404),
        "detalhes": openapi.Schema(type=openapi.TYPE_STRING, example="Extensionista não encontrado com o ID fornecido.")
    }
)


#Falta de permissões
erro_permissao_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "detail": openapi.Schema(type=openapi.TYPE_STRING, example="Você não tem permissão para executar esta ação.")
    }
)

#Violação da integridade (PARTICIPANTE)
erro_participante_integridade_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "erro": openapi.Schema(type=openapi.TYPE_STRING, example="Violação da integridade de dados"),
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

#Violação de integridade(TECHLEADER)
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

#Violação de integridade (EMPRESA)
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
            example={"usuario": ["Já existe um usuário com esse nome"]}
        )
    }
)

#Violação de integridade (EXCEÇÃO)
erro_excecao_integridade_schema = openapi.Schema(
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

#Violação de integridade (EXTENSIONISTA)
erro_extensionista_integridade_schema = openapi.Schema(
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
            example={"participante": ["Este participante já é um extensionista"]}
        )
    }
)

#Mensagem de sucesso mais detalhada (PARTICIPANTE)
success_participante_schema = openapi.Response(
    description="Participante criado/atualizado com sucesso",
    schema=ParticipanteSerializer,
    examples={
        "application/json": {
            "sucesso": True,
            "resultado": {
                "id": 1,
                "usuario": {
                    "id": 1,
                    "nome": "Walace",
                    "username": "walace@email.com",
                    "telefone": "83999999999"
                },
                "cpf": "12345678901",
                "rgm": "12345678",
                "curso": "ADS",
                "periodo": 3,
                "extensionista": {
                    "extensionista": True,
                    "veterano": False
                },
                "imersionista": {
                    "id_participacao": 1,
                    "id_imersao": 1
                }
            },
            "erro": "",
            "detalhes": []
        }
    }
)

#Mensagem de sucesso mais detalhada (TECHLEADER)
success_techleader_schema = openapi.Response(
    description="Tech Leader criado/atualizado com sucesso",
    schema=TechLeaderSerializer,
    examples={
        "application/json": {
            "sucesso": True,
            "resultado": {
                "id": 1,
                "usuario": {
                    "id": 1,
                    "nome": "Walace2",
                    "username": "Walace2@email.com",
                    "telefone": "83988888888"
                },
                "codigo": "TL123",
                "especialidade": "Backend Development"
            },
            "erro": "",
            "detalhes": []
        }
    }
)

#Mensagem de sucesso mais detalhada (EMPRESA)
success_empresa_schema = openapi.Response(
    description="Empresa criada/atualizada com sucesso",
    schema=EmpresaSerializer,
    examples={
        "application/json": {
            "sucesso": True,
            "resultado": {
                "id": 1,
                "usuario": {
                    "id": 1,
                    "nome": "Empresa LTDA",
                    "username": "contato@empresa.com",
                    "telefone": "8333333333"
                },
                "cnpj": "12345678000199",
                "representante": "João da Silva"
            },
            "erro": "",
            "detalhes": []
        }
    }
)

#Mensagem de sucesso mais detalhada (EXCEÇÃO)
success_excecao_schema = openapi.Response(
    description="Exceção criada/atualizada com sucesso",
    schema=ExcecaoSerializer,
    examples={
        "application/json": {
            "sucesso": True,
            "resultado": {
                "id": 1,
                "usuario": {
                    "id": 1,
                    "nome": "Walace3",
                    "username": "walace3@email.com",
                    "telefone": "83977777777"
                },
                "motivo": "Participação especial, curso paralelo",
                "nota": "Aluno interessado na área de TI",
                "extensionista": {
                    "extensionista": True,
                    "veterano": False
                }
            },
            "erro": "",
            "detalhes": []
        }
    }
)

#Mensagem de sucesso mais detalhada (EXTENSIONISTA)
success_extensionista_schema = openapi.Response(
    description="Extensionista criado/atualizado com sucesso",
    schema=ExtensionistaSerializer,
    examples={
        "application/json": {
            "sucesso": True,
            "resultado": {
                "id": 1,
                "participante": {
                    "id": 1,
                    "usuario": {
                        "id": 1,
                        "nome": "Walace4"
                    }
                },
                "veterano": True
            },
            "erro": "",
            "detalhes": []
        }
    }
)

#Mensagem de sucesso mais detalhada (LOGIN)
success_login_schema = openapi.Response(
    description="Login realizado com sucesso",
    examples={
        "application/json": {
            "sucesso": True,
            "resultado": {
                "access": "token_de_acesso",
                "refresh": "token_de_refresh",
                "nome": "Walace5",
                "email": "Walace5@email.com",
                "tipo_usuario": "PART" #(participante)
            },
            "erro": "",
            "detalhes": []
        }
    }
)

#Mensagem de sucesso mais detalhada (ADMIN)
success_admin_schema = openapi.Response(
    description="Admin criado com sucesso",
    examples={
        "application/json": {
            "sucesso": True,
            "resultado": {
                "id": 1,
                "nome": "WalaceAdmin",
                "username": "WalaceAdmin@email.com",
                "is_staff": True,
                "is_superuser": True
            },
            "erro": "",
            "detalhes": []
        }
    }
)

#SWAGGER PARTICIPANTE
def list_participantes_swagger():
    return swagger_auto_schema(
        operation_description="Lista todos os participantes cadastrados no sistema. "
                            "Participantes só podem ver seus próprios dados, exceto administradores.",
        responses={
            200: openapi.Response('Lista de participantes', ParticipanteSerializer(many=True)),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Participantes']
    )

def create_participantes_swagger():
    return swagger_auto_schema(
        operation_description="Cria um novo participante da Fábrica de Software. "
                            "Campos obrigatórios: nome, email (username), password, cpf, rgm, curso, periodo.",
        request_body=ParticipanteSerializer,
        responses={
            201: success_participante_schema,
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            409: openapi.Response('Conflito de dados', erro_participante_integridade_schema)
        },
        tags=['Participantes']
    )

def retrieve_participantes_swagger():
    return swagger_auto_schema(
        operation_description="Obtém detalhes de um participante específico. "
                            "Participantes só podem ver seus próprios dados, exceto administradores.",
        responses={
            200: success_participante_schema,
            404: openapi.Response('Não encontrado', erro_participante_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Participantes']
    )

def update_participantes_swagger():
    return swagger_auto_schema(
        operation_description="Atualiza todos os dados de um participante. "
                            "Participantes só podem atualizar seus próprios dados, exceto administradores.",
        request_body=ParticipanteSerializer,
        responses={
            200: success_participante_schema,
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            404: openapi.Response('Não encontrado', erro_participante_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema),
            409: openapi.Response('Conflito de dados', erro_participante_integridade_schema)
        },
        tags=['Participantes']
    )

def partial_update_participantes_swagger():
    return swagger_auto_schema(
        operation_description="Atualiza parcialmente um participante. "
                            "Participantes só podem atualizar seus próprios dados, exceto administradores.",
        request_body=ParticipanteSerializer,
        responses={
            200: success_participante_schema,
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            404: openapi.Response('Não encontrado', erro_participante_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema),
            409: openapi.Response('Conflito de dados', erro_participante_integridade_schema)
        },
        tags=['Participantes']
    )

def delete_participantes_swagger():
    return swagger_auto_schema(
        operation_description="Exclui um participante do sistema. "
                            "Apenas administradores podem executar esta ação.",
        responses={
            204: "Participante excluído com sucesso",
            404: openapi.Response('Não encontrado', erro_participante_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Participantes']
    )

#SWAGGER TECHLEADER
def list_techleaders_swagger():
    return swagger_auto_schema(
        operation_description="Lista todos os tech leaders cadastrados. "
                            "Acesso restrito a administradores e tech leaders.",
        responses={
            200: openapi.Response('Lista de tech leaders', TechLeaderSerializer(many=True)),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Tech Leaders']
    )

def create_techleaders_swagger():
    return swagger_auto_schema(
        operation_description="Cria um novo tech leader. "
                            "Campos obrigatórios: nome, email (username), password, codigo, especialidade. "
                            "Acesso restrito a administradores.",
        request_body=TechLeaderSerializer,
        responses={
            201: success_techleader_schema,
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            409: openapi.Response('Conflito de dados', erro_techleader_integridade_schema)
        },
        tags=['Tech Leaders']
    )

def retrieve_techleaders_swagger():
    return swagger_auto_schema(
        operation_description="Obtém detalhes de um tech leader específico. "
                            "Tech leaders só podem ver seus próprios dados, exceto administradores.",
        responses={
            200: success_techleader_schema,
            404: openapi.Response('Não encontrado', erro_techleader_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Tech Leaders']
    )

def update_techleaders_swagger():
    return swagger_auto_schema(
        operation_description="Atualiza todos os dados de um tech leader. "
                            "Tech leaders só podem atualizar seus próprios dados, exceto administradores.",
        request_body=TechLeaderSerializer,
        responses={
            200: success_techleader_schema,
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            404: openapi.Response('Não encontrado', erro_techleader_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema),
            409: openapi.Response('Conflito de dados', erro_techleader_integridade_schema)
        },
        tags=['Tech Leaders']
    )

def partial_update_techleaders_swagger():
    return swagger_auto_schema(
        operation_description="Atualiza parcialmente um tech leader. "
                            "Tech leaders só podem atualizar seus próprios dados, exceto administradores.",
        request_body=TechLeaderSerializer,
        responses={
            200: success_techleader_schema,
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            404: openapi.Response('Não encontrado', erro_techleader_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema),
            409: openapi.Response('Conflito de dados', erro_techleader_integridade_schema)
        },
        tags=['Tech Leaders']
    )

def delete_techleaders_swagger():
    return swagger_auto_schema(
        operation_description="Exclui um tech leader do sistema. "
                            "Apenas administradores podem executar esta ação.",
        responses={
            204: "Tech leader excluído com sucesso",
            404: openapi.Response('Não encontrado', erro_techleader_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Tech Leaders']
    )

#SWAGGER EMPRESA
def list_empresas_swagger():
    return swagger_auto_schema(
        operation_description="Lista todas as empresas parceiras cadastradas. "
                            "Empresas só podem ver seus próprios dados, exceto administradores.",
        responses={
            200: openapi.Response('Lista de empresas', EmpresaSerializer(many=True)),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Empresas']
    )

def create_empresas_swagger():
    return swagger_auto_schema(
        operation_description="Cria uma nova empresa parceira. "
                            "Campos obrigatórios: nome, email (username), password, cnpj, representante. "
                            "Acesso restrito a administradores.",
        request_body=EmpresaSerializer,
        responses={
            201: success_empresa_schema,
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            409: openapi.Response('Conflito de dados', erro_empresa_integridade_schema)
        },
        tags=['Empresas']
    )

def retrieve_empresas_swagger():
    return swagger_auto_schema(
        operation_description="Obtém detalhes de uma empresa específica. "
                            "Empresas só podem ver seus próprios dados, exceto administradores.",
        responses={
            200: success_empresa_schema,
            404: openapi.Response('Não encontrado', erro_empresa_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Empresas']
    )

def update_empresas_swagger():
    return swagger_auto_schema(
        operation_description="Atualiza todos os dados de uma empresa. "
                            "Empresas só podem atualizar seus próprios dados, exceto administradores.",
        request_body=EmpresaSerializer,
        responses={
            200: success_empresa_schema,
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            404: openapi.Response('Não encontrado', erro_empresa_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema),
            409: openapi.Response('Conflito de dados', erro_empresa_integridade_schema)
        },
        tags=['Empresas']
    )

def partial_update_empresas_swagger():
    return swagger_auto_schema(
        operation_description="Atualiza parcialmente uma empresa. "
                            "Empresas só podem atualizar seus próprios dados, exceto administradores.",
        request_body=EmpresaSerializer,
        responses={
            200: success_empresa_schema,
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            404: openapi.Response('Não encontrado', erro_empresa_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema),
            409: openapi.Response('Conflito de dados', erro_empresa_integridade_schema)
        },
        tags=['Empresas']
    )

def delete_empresas_swagger():
    return swagger_auto_schema(
        operation_description="Exclui uma empresa do sistema. "
                            "Apenas administradores podem executar esta ação.",
        responses={
            204: "Empresa excluída com sucesso",
            404: openapi.Response('Não encontrado', erro_empresa_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Empresas']
    )

#SWAGGER EXCEÇÃO
def list_excecoes_swagger():
    return swagger_auto_schema(
        operation_description="Lista todos as exceções cadastradas. "
                            "Acesso restrito a administradores.",
        responses={
            200: openapi.Response('Lista de exceções', ExcecaoSerializer(many=True)),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Exceções']
    )

def create_excecoes_swagger():
    return swagger_auto_schema(
        operation_description="Cria um novo registro de exceção. "
                            "Campos obrigatórios: nome, email (username), password, motivo. "
                            "Acesso restrito a administradores.",
        request_body=ExcecaoSerializer,
        responses={
            201: success_excecao_schema,
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            409: openapi.Response('Conflito de dados', erro_excecao_integridade_schema)
        },
        tags=['Exceções']
    )

def retrieve_excecoes_swagger():
    return swagger_auto_schema(
        operation_description="Obtém detalhes de uma exceção específica. "
                            "Acesso restrito a administradores.",
        responses={
            200: success_excecao_schema,
            404: openapi.Response('Não encontrado', erro_excecao_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Exceções']
    )

def update_excecoes_swagger():
    return swagger_auto_schema(
        operation_description="Atualiza todos os dados de uma exceção. "
                            "Acesso restrito a administradores.",
        request_body=ExcecaoSerializer,
        responses={
            200: success_excecao_schema,
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            404: openapi.Response('Não encontrado', erro_excecao_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema),
            409: openapi.Response('Conflito de dados', erro_excecao_integridade_schema)
        },
        tags=['Exceções']
    )

def partial_update_excecoes_swagger():
    return swagger_auto_schema(
        operation_description="Atualiza parcialmente uma exceção. "
                            "Acesso restrito a administradores.",
        request_body=ExcecaoSerializer,
        responses={
            200: success_excecao_schema,
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            404: openapi.Response('Não encontrado', erro_excecao_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema),
            409: openapi.Response('Conflito de dados', erro_excecao_integridade_schema)
        },
        tags=['Exceções']
    )

def delete_excecoes_swagger():
    return swagger_auto_schema(
        operation_description="Exclui uma exceção do sistema. "
                            "Apenas administradores podem executar esta ação.",
        responses={
            204: "Exceção excluída com sucesso",
            404: openapi.Response('Não encontrado', erro_excecao_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Exceções']
    )

#SWAGGER EXTENSIONISTA
def list_extensionistas_swagger():
    return swagger_auto_schema(
        operation_description="Lista todos os extensionistas cadastrados. "
                            "Acesso restrito a administradores.",
        responses={
            200: openapi.Response('Lista de extensionistas', ExtensionistaSerializer(many=True)),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Extensionistas']
    )

def create_extensionistas_swagger():
    return swagger_auto_schema(
        operation_description="Cria um novo extensionista. "
                            "Deve referenciar um participante ou exceção existente. "
                            "Acesso restrito a administradores.",
        request_body=ExtensionistaSerializer,
        responses={
            201: success_extensionista_schema,
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            409: openapi.Response('Conflito de dados', erro_extensionista_integridade_schema)
        },
        tags=['Extensionistas']
    )

def retrieve_extensionistas_swagger():
    return swagger_auto_schema(
        operation_description="Obtém detalhes de um extensionista específico. "
                            "Acesso restrito a administradores.",
        responses={
            200: success_extensionista_schema,
            404: openapi.Response('Não encontrado', erro_extensionista_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Extensionistas']
    )

def update_extensionistas_swagger():
    return swagger_auto_schema(
        operation_description="Atualiza todos os dados de um extensionista. "
                            "Acesso restrito a administradores.",
        request_body=ExtensionistaSerializer,
        responses={
            200: success_extensionista_schema,
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            404: openapi.Response('Não encontrado', erro_extensionista_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema),
            409: openapi.Response('Conflito de dados', erro_extensionista_integridade_schema)
        },
        tags=['Extensionistas']
    )

def partial_update_extensionistas_swagger():
    return swagger_auto_schema(
        operation_description="Atualiza parcialmente um extensionista. "
                            "Acesso restrito a administradores.",
        request_body=ExtensionistaSerializer,
        responses={
            200: success_extensionista_schema,
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            404: openapi.Response('Não encontrado', erro_extensionista_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema),
            409: openapi.Response('Conflito de dados', erro_extensionista_integridade_schema)
        },
        tags=['Extensionistas']
    )

def delete_extensionistas_swagger():
    return swagger_auto_schema(
        operation_description="Exclui um extensionista do sistema. "
                            "Apenas administradores podem executar esta ação.",
        responses={
            204: "Extensionista excluído com sucesso",
            404: openapi.Response('Não encontrado', erro_extensionista_nao_encontrado_schema),
            403: openapi.Response('Erro de permissão', erro_permissao_schema)
        },
        tags=['Extensionistas']
    )

#SWAGGER AUTENTICAÇÃO
def login_swagger():
    return swagger_auto_schema(
        operation_description="Realiza login no sistema e retorna tokens JWT. "
                            "Campos obrigatórios: username (email) e password.",
        request_body=CustomTokenSerializer,
        responses={
            200: success_login_schema,
            400: openapi.Response('Credenciais inválidas', erro_validacao_schema),
            401: openapi.Response('Conta inativa', erro_permissao_schema)
        },
        tags=['Autenticação']
    )

def admin_create_swagger():
    return swagger_auto_schema(
        operation_description="Cria um novo usuário administrador. "
                            "Acesso restrito a superusuários.",
        request_body=AdminCreateSerializer,
        responses={
            201: success_admin_schema,
            400: openapi.Response('Erro de validação', erro_validacao_schema),
            409: openapi.Response('Conflito de dados', erro_participante_integridade_schema)
        },
        tags=['Administração']
    )
    
# #Mensagem de sucesso mais detalhada (PERFIL)
# success_perfil_schema = openapi.Response(
#     description="Operação realizada com sucesso",
#     schema=openapi.Schema(
#         type=openapi.TYPE_OBJECT,
#         properties={
#             "sucesso": openapi.Schema(type=openapi.TYPE_BOOLEAN),
#             "resultado": openapi.Schema(
#                 type=openapi.TYPE_OBJECT,
#                 oneOf=[
#                     success_participante_schema.schema,
#                     success_techleader_schema.schema,
#                     success_empresa_schema.schema,
#                     success_excecao_schema.schema,
#                     success_extensionista_schema.schema
#                 ]
#             ),
#             "erro": "",
#             "detalhes": []
#         }
#     )
# )