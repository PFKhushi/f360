# ex2024_2_F360_Daniel Brandão

Este projeto é uma API RESTful desenvolvida em Django para gerenciar usuários e suas experiências profissionais, incluindo informações detalhadas sobre curso, cargo, setor e tecnologia.

## Descrição

A API permite o gerenciamento de um CRUD (Create, Read, Update, Delete) de dois modelos principais:
1. **Usuários**: Armazena informações sobre o usuário, incluindo CPF, e-mail, curso, cargo, setor e situação.
2. **Experiências**: Associa cada usuário a uma ou mais experiências, detalhando o nível de senioridade e as tecnologias com as quais ele já trabalhou.

## Modelos Principais

- **Usuários**
  - Permite controlar informações acadêmicas e profissionais do usuário na plataforma.

- **Experiências**

  - Permite registrar as experiências do usuário com diferentes tecnologias e níveis de senioridade.

## Instalação

### Requisitos

- Python 3.8+
- Django 3.2+
- Django Rest Framework
- `django-localflavor` para validação de CPF

### Passo a Passo

1. Clone o repositório:

    ```bash
    git clone https://gitlab.com/repositoriodafabrica/ex2024_2_f360_daniel-brandao.git
    cd ex2024_2_f360_daniel-brandao
    ```

2. Crie e ative um ambiente virtual:

    ```bash
    python3 -m venv env
    source env/bin/activate  # Linux ou MacOS
    env\Scripts\activate  # Windows
    ```

3. Instale as dependências:

    ```bash
    pip install -r requirements.txt
    ```

4. Aplique as migrações:

    ```bash
    python manage.py migrate
    ```

5. Crie um superusuário para acessar o painel de administração:

    ```bash
    python manage.py createsuperuser
    ```

6. Inicie o servidor de desenvolvimento:

    ```bash
    python manage.py runserver
    ```

## Endpoints da API

1. `/api/usuarios/` - CRUD de usuários.
2. `/api/experiencias/` - CRUD de experiências de usuário.

## Estrutura do Projeto

- `models.py` - Contém os modelos `Usuarios` e `Experiencias`.
- `serializers.py` - Serializadores para os modelos da API.
- `views.py` - Lógica de visualização para os endpoints.
- `urls.py` - Configurações de roteamento para os endpoints da API.

## Exemplos de Uso

### Criar um Usuário

```json
POST /api/usuarios/
{
  "nome": "Exemplo",
  "cpf": "123.456.789-09",
  "username": "exemplo@cs.cruzeirodosul.edu.br",
  "email_institucional": "exemplo@cs.cruzeirodosul.edu.br",
  "rgm": "12345678",
  "curso": "ADS",
  "cargo": "IMERSIONISTA",
  "setor": "BACK",
  "situacao": "ATIVO"
}
````
### Criar uma Experiência 
```json
POST /api/experiencias/
{
  "usuario": 1,
  "tecnologias": "DJANGO_PYTHON",
  "senioridade": "JUNIOR",
  "descricao": "Desenvolvimento de API com Django"
}
```

## Licença 
Apenas para Programadores da Fábrica de Sofwares

