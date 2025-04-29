from drf_yasg import openapi

swagger_info = openapi.Info(
    title="API Fábrica de Software",
    default_version='v1',
    description="""
    API completa para gerenciamento da Fábrica de Software, incluindo:
    - Autenticação JWT
    - Gerenciamento de usuários (Participantes, Empresas, Tech Leaders)
    - Gerenciamento de Imersões
    - Inscrições e participações
    """,
    contact=openapi.Contact(email="contato@fabrica.com"),
    license=openapi.License(name="BSD License"),
    terms_of_service="https://www.fabrica.com/terms/",
)