# Manuais de uso
Esta API possui um painel de administrador para suprir necessidades imediatas do cliente. Não é algo definitivo. 

## Tabela de conteudos
1. [Manual da API](#manual-api-fabrica-de-software)
2. [Manual de Painel de Admin](#manual-painel-administrativo-Fabrica-de-software)

# Manual API Fábrica de Software

Bem-vindo à documentação da API da Fábrica de Software. Esta API é projetada para gerenciar todos os aspectos do ecossistema da fábrica, incluindo usuários (participantes, empresas, tech leaders), ciclos de imersão, workshops, e projetos.

## Tabela de Conteúdos

1. [Configuração Inicial](#configuração-inicial)
2. [Autenticação (JWT)](#autenticação-jwt)
   - [Obtendo um Token (Login)](#obtendo-um-token-login)
   - [Utilizando o Token](#utilizando-o-token)
   - [Fazendo Logout](#fazendo-logout)
3. [Padrão de Resposta](#padrão-de-resposta)
   - [Sucesso](#sucesso)
   - [Erro](#erro)
4. [Endpoints da API](#endpoints-da-api)
   - [Gerenciamento de Usuários e Perfis](#gerenciamento-de-usuários-e-perfis)
   - [Gerenciamento de Extensionistas](#gerenciamento-de-extensionistas)
   - [Gerenciamento de Emails Autorizados](#gerenciamento-de-emails-autorizados)
   - [Gerenciamento de Imersão e Workshops](#gerenciamento-de-imersão-e-workshops)
   - [Gerenciamento de Projetos](#gerenciamento-de-projetos)

---

## Configuração Inicial

Para executar o projeto localmente, siga estes passos:

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd <pasta-do-projeto>
   ```

2. **Crie e ative um ambiente virtual:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # No Windows: venv\Scripts\activate
   ```

3. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Crie as migrações do banco de dados:**
    ```bash
    python manage.py makemigrations
    ```

5. **Execute as migrações do banco de dados:**
   ```bash
   python manage.py migrate
   ```

6. **Crie um superusuário (admin):**
   - **Importante:** Antes de criar, o email do seu superusuário deve ser adicionado à lista de emails de administradores (veja a seção [Emails de Admins](#emails-de-admins)). Recomendo inserir diretamente no banco, utilizando a tabela `imersao_emailsadmins.
   ```bash
   python manage.py createsuperuser
   ```

6. **Inicie o servidor de desenvolvimento:**
   ```bash
   python manage.py runserver
   ```
   A API estará disponível em `http://127.0.0.1:8000/`.

---

## Autenticação (JWT)

A API utiliza JSON Web Tokens (JWT) para autenticação. Todas as requisições para endpoints protegidos devem incluir um `access token` no cabeçalho.

### Obtendo um Token (Login)

Para se autenticar, envie uma requisição `POST` para o endpoint de login com as credenciais do usuário. O email do usuário deve estar previamente autorizado para algum perfil no sistema.

- **Endpoint:** `POST` `/api/login/`
- **Permissão:** Aberto
- **Corpo da Requisição:**

  ```json
  {
      "username": "email.do.usuario@dominio.com",
      "password": "sua_senha"
  }
  ```

- **Resposta de Sucesso (200 OK):**

  ```json
  {
      "sucesso": true,
      "resultado": {
          "refresh": "eyJhbGciOiJI...",
          "access": "eyJhbGciOiJI..."
      },
      "erro": "",
      "detalhes": []
  }
  ```

- **O token contem as seguintes informções extras:**

  ```json
    {
        "id": 1,
        "nome": "Nome do Usuário",
        "email": "email.do.usuario@dominio.com",
        "tipo_usuario": "ADMIN"
    }
  ```

### Utilizando o Token

Para acessar endpoints protegidos, inclua o `access token` no cabeçalho `Authorization`:

```
Authorization: Bearer <seu_access_token>
```

### Fazendo Logout

Para fazer logout, envie o `refresh_token` para o endpoint de logout. Isso irá adicionar o token a uma "blacklist", invalidando-o.

- **Endpoint:** `POST` `/api/logout/`
- **Permissão:** Autenticado
- **Corpo da Requisição:**

  ```json
  {
      "refresh_token": "seu_refresh_token"
  }
  ```
- **Resposta de Sucesso (200 OK):**

  ```json
  {
      "detail": "Logout realizado com sucesso!",
      "sucesso": true,
      "erro": "",
      "detalhes": []
  }
  ```

---

## Padrão de Resposta

A API utiliza um formato de resposta JSON padronizado para todas as requisições.

### Sucesso

Uma resposta bem-sucedida sempre terá a chave `"sucesso": true` e os dados estarão dentro da chave `"resultado"`.

```json
{
    "sucesso": true,
    "resultado": { "...": "..." },
    "erro": "",
    "detalhes": []
}
```

### Erro

Uma resposta de erro terá `"sucesso": false` e as chaves `"erro"` e `"detalhes"` conterão informações sobre o que deu errado.

```json
{
    "sucesso": false,
    "resultado": null,
    "erro": "Erro de validação nos dados enviados",
    "detalhes": [
        "cpf: Este CPF já está cadastrado"
    ]
}
```

---

## Endpoints da API

### Gerenciamento de Usuários e Perfis

**Base URL:** `/api/usuario/`

Este é um endpoint roteador que unifica o gerenciamento de todos os tipos de usuários.

A listagem de todos os usuários não está feita. Fazer `GET` para:
- **Endpoints:** `api/participante/` | `api/excecao/` | `api/techleader/` | `api/empresa/`
- **Permissão:** Listagem, apenas Administradores
#### Criar um Novo Usuário (com Perfil)

Para criar um usuário, envie uma requisição `POST` para `/api/usuario/` e especifique o tipo de perfil desejado no campo `"perfil"`.



- **Endpoint:** `POST` `/api/usuario/`
- **Permissão:** Aberto (requer que o email esteja na lista de autorizados para o perfil)
- **Exemplo: Criando um Admin**

  ```json
  {
      "perfil": "admin",
      "nome": {{nome}},
      "username": {{email}},
      "password": {{senha}},
      "telefone": {{telefone}},
  }
  ```

- **Exemplo: Criando um Participante**

  ```json
  {
      "perfil": "participante",
      "nome": {{nome}},
      "username": {{email}},
      "password": {{senha}},
      "telefone": {{telefone}},
      "cpf": {{cpf}},
      "rgm": {{rmg}},
      "curso": "ADS", #Opções: "ADS", "CC", "SI", "CD", "OTR"
      "periodo": {{periodo}}
  }
  ```

- **Exemplo Criando uma Exceção**

  ```json
  {
      "perfil": "excecao",
      "nome": {{nome}},
      "username": {{email}},
      "password": {{senha}},
      "telefone": {{telefone}},
      "motivo": {{motivo}},
      "nota": {{nota}}
  }
  ```

- **Exemplo Criando um Tech Leader**

  ```json
  {
      "perfil": "techleader",
      "nome": {{nome}},
      "username": {{email}},
      "password": {{senha}},
      "telefone": {{telefone}},
      "codigo": {{codigo}},
      "especialidade": {{especialidade}}
  }
  ```

- **Exemplo: Criando uma Empresa**

  ```json
  {
      "perfil": "empresa",
      "nome": {{nome}},
      "username": {{email}},
      "password": {{senha}},
      "telefone": {{telefone}},
      "cnpj": {{cnpj}},
      "representante": {{nome_representante}}
  }
  ```

#### Visualizar, Atualizar ou Deletar um Perfil de Usuário

Para manipular um perfil existente, use o endpoint aninhado `/perfil/` com o ID do usuário. A API identificará automaticamente o tipo de perfil e aplicará as regras corretas.

- **Endpoint:** `GET` `PUT` `PATCH` `DELETE` `/api/usuario/{id}/perfil/`
- **Permissão:**

  - `GET` `PUT` `PATCH`: Dono do perfil ou Administrador
  - `DELETE`: Apenas Administrador

- **Exemplo: Atualizando parcialmente um participante (usuário com ID 12)**

  ```http
  PATCH /api/usuario/{{id_usuario_A}}/perfil/
  ```
  ```json
  {
      "telefone": {{telefone}},
      "periodo": {{periodo}}
  }
  ```

---

### Gerenciamento de Extensionistas

**Base URL:** `/api/extensionista/` e `/api/extensionistas/`

#### Listar ou Manipular Extensionistas individualmente

- **Endpoint:** `GET` `POST` `PUT` `PATCH` `DELETE` `/api/extensionista/`
- **Permissão:** Apenas Administradores
- **Lógica:** O modelo Extensionista vincula um participante ou uma exceção a este papel. No POST, deve-se fornecer `usuario`. Caso ele possa ser extensionista, retorna a confirmação ou rejeição.
- **Corpo da Requisição:**

  ```json
  {
      "usuario": {{id_usuario_A}}
  }
  ```

#### Criar Extensionistas em Massa

- **Endpoint:** `POST` `/api/extensionistas/`
- **Permissão:** Apenas Administradores
- **Corpo da Requisição:**

  ```json
  {
      "usuarios": [
        {{id_usuario_A}}, {{id_usuario_B}}
      ]
  }
  ```

- **Resposta de Sucesso:**

  ```json
  {
      "sucesso": true,
      "resultado": {
          "criados": [
              { "usuario_id": 12, "extensionista_id": 1, "nome": "...", "email": "..." },
              { "usuario_id": 15, "extensionista_id": 2, "nome": "...", "email": "..." }
          ],
          "rejeitados": [
              { "id": 21, "nome": "...", "email": "...", "erro": "Já é Extensionista" }
          ]
      },
      "erro": "",
      "detalhes": []
  }
  ```

#### Remover Extensionistas em Massa

- **Endpoint:** `POST` `/api/extensionistas/delete_bulk/`
- **Permissão:** Apenas Administradores
- **Corpo da Requisição:**

  ```json
  {
      "usuarios": [
        {{id_usuario_A}}, {{id_usuario_B}}
      ]
  }
  ```

---

### Gerenciamento de Emails Autorizados

Estes endpoints permitem que administradores controlem quais emails podem se registrar em cada tipo de perfil.

#### Emails de Admins

**Base URL:** `/api/emails_admins/`

- `GET` `/api/emails_admins/`: Lista todos os emails de administradores autorizados
- `POST` `/api/emails_admins/`: Adiciona uma lista de emails

  ```json
  { "emails": ["admin1@fabrica.com", "admin2@fabrica.com"] }
  ```

- `POST` `/api/emails_admins/delete_bulk/`: Remove uma lista de emails

  ```json
  { "emails": ["admin2@fabrica.com"] }
  ```

#### Emails de Membros (Empresas/TechLeaders)

**Base URL:** `/api/emails_membros/`

Endpoints e corpos de requisição análogos ao de Admins.

#### Emails de Participantes (Participantes/Exceções)

**Base URL:** `/api/emails_participantes/`

Endpoints e corpos de requisição análogos, com um campo opcional `iteracao` (ID da Iteração) para vincular a autorização a um ciclo específico. Se omitido, usa a iteração ativa.

---

### Gerenciamento de Imersão e Workshops

Este conjunto de endpoints gerencia os ciclos de atividades da fábrica.

#### Iteração

**Base URL:** `/api/iteracao/`

- Gerencia os ciclos (ex: 2025.1)
- **Permissão:** Admins para escrita, autenticados para leitura
- **Lógica:** Apenas uma iteração pode estar com `"ativa": true`. O serializer cuida disso automaticamente.
- **Corpo da Requisição:**
  ```json
  {
      "ano": "{{ano}}",
      "semestre": "{{semestre}}"
  }
  ```

#### Imersão

**Base URL:** `api/imersao/`

- Liga Palestras e Formuários à Itereção.
- **Permissão:** Admins para escrita, autenticados para leitura
- **Lógica:** Imersão será vinculada à Iteração informada caso ativa ou gera uma nova Iteração com os dados fornecidos se não houver, caso contrário conta como ter enviado a Iteração.
- **IMPORTANTE:** Ou se envia a Iteração ou os dados na Iteração
- **Corpo da Requisição:** (Com Iteração)
  ```json
  {
      "iteracao": "{{iteracao_id}}"
  }
  ```
- **Corpo da Requisição:** (Sem Iteração)
  ```json
  {
      "ano": "{{ano}}",
      "semestre": "{{semestre}}"
  }
  ```


#### Área Fábrica 

**Base URL:** `api/area_fabrica/`

- Gerencia Áreas de atuação que serão usadas nos Workshops e Projetos da Fábrica
- **Permissão:** Admins para escrita, autenticados para leitura
- **Lógica:** Pode ser criada com um Boolean `ativa` ou sem, mas o `nome` é obrigatório.
- **Corpo da Requisição:**
  ```json
  {
      "nome": "{{area_fabrica_A_nome2}}",
      "ativa": "false"
  }
  ```

#### Tecnologias 

- **Endpoint:** `GET` `POST` `api/area_fabrica/`
- Gerencia Tecnologias envolvidas na Fábrica
- **Permissão:** Usuários autenticados
- **Lógica:** Pode ser criada com um Boolean `ativa` ou sem(Sentido obsoleto), mas o `nome` é obrigatório.
- **Corpo da Requisição:**

  ```json
  {
      "nome": "{{area_fabrica_A_nome2}}",
      "ativa": "bool"
  }
  ```

- **Endpoint:** `GET` `PUT` `PATCH` `DELETE` `api/area_fabrica/{{id_area}}`
- Gerencia Tecnologias envolvidas na Fábrica
- **Permissão:** Admins para escrita, autenticados para leitura
- **Lógica:** Pode ser criada com um Boolean `ativa` ou sem (Sentido obsoleto), mas o `nome` é obrigatório.
- **Corpo da Requisição:**

  ```json
  {
      "nome": "{{area_fabrica_A_nome2}}",
      "ativa": "bool"
  }
  ```

#### Palestra


- **Endpoint:** `GET` `POST` `api/palestra/`
- Gerencia Palestras
- **Permissão:** Admins para escrita, autenticados para leitura
- **Lógica:** Se uma `imersao` não for fornecida, o sistema tentará vincular à uma Imersão com Iteração ativa.
- **Corpo da Requisição:** 

  ```json
  {
    "imersao": {{id_imersao}}
    "titulo": "{{titulo}}",
    "descricao": "{{descricao}}",
    "data": "{{data_inicio}}",
    "palestrante": "{{nome_palestrante}}",
    "sala": "{{sala}}",
    "bloco": "{{bloco}}"
  }
  ```

- **Endpoint:** `GET` `PUT` `PATCH` `DELETE` `api/palestra/`
- Gerencia Palestras
- **Permissão:** Admins para escrita, autenticados para leitura
- **Lógica:** Se uma `imersao` não for fornecida, o sistema tentará vincular à uma Imersão com Iteração ativa.
- **Corpo da Requisição:** 

  ```json
  {
    "imersao": {{id_imersao}}
    "titulo": "{{titulo}}",
    "descricao": "{{descricao}}",
    "data": "{{data_inicio}}",
    "palestrante": "{{nome_palestrante}}",
    "sala": "{{sala}}",
    "bloco": "{{bloco}}"
  }
  ```


#### Formulário de Inscrição Participante

- **Endpoint:** `GET` `POST` `/api/formulario_inscricao/`
- **Permissão:** Participante autenticado
- **Lógica:** Permite que um participante se inscreva na imersão ativa
- **Corpo da Requisição:**

  ```json
  {
    "primeira_opcao": {{id_area_fabrica_A}},
    "segunda_opcao": {{id_area_fabrica_B}},
    "tecnologias": [{{id_tecnologia_fabrica_A}}, {{id_tecnologia_fabrica_B}}],
    "interesses": [
        {"area": {{id_area_fabrica_A}}, "nivel": 5},
        {"area": {{id_area_fabrica_B}}, "nivel": 4},
        {"area": {{id_area_fabrica_C}}, "nivel": 2}
    ],
    "outras_tech": [
        {"nome": "Computação Quântica"}
    ]
  }
  ```

#### Formulário de Inscrição Participante(Administrador)

  Administrador também consegue criar formulários de participantes (`excecao` e outros usuários não conseguem se inscrever), mas precisa enviar um `id_usuario` para funcionar. E pode também enviar uma `imersao`, caso queiro colocar esse formulário em outra imersão que não seja da `iteracao` ativa.

- **Endpoint:** `GET` `POST` `/api/formulario_inscricao/`
- **Permissão:** Apenas Administradores
- **Lógica:** Permite que um administrador inscreva um participante (exclusivamente) na imersão indicada ou na ativa, caso `imersao` ausente.
- **Corpo da Requisição:**

  ```json
  {    
    "id_usuario": {{id_usuario}},
    "imersao": {{id_imersao}},
    "tecnologias": [{{id_tecnologia_fabrica_A}}, {{id_tecnologia_fabrica_B}}],  
    "primeira_opcao": {{id_area_fabrica_A}},
    "segunda_opcao": {{id_area_fabrica_B}},
    "interesses": [
          {"area": {{id_area_fabrica_A}}, "nivel": 5},
          {"area": {{id_area_fabrica_B}}, "nivel": 4},
          {"area": {{id_area_fabrica_C}}, "nivel": 2}
      ],
  }
  ```

- **Endpoint:** `GET` `PUT` `PATCH` `DELETE` `/api/formulario_inscricao/{{id_formulario}}/`
- **Permissão:** Participante autenticado
- **Lógica:** Permite Admin e Usuário editarem formulário.
- **IMPORTANTE:** Lista de interesses são substituidas, não incrementadas.
- **Corpo da Requisição:**

  ```json
  {
      "primeira_opcao": {{id_area_fabrica_A}},
      "segunda_opcao": {{id_area_fabrica_B}},
      "tecnologias": [{{id_tecnologia_fabrica_A}}, {{id_tecnologia_fabrica_B}}],
      "interesses": [
          {"area": {{id_area_fabrica_A}}, "nivel": 5},
          {"area": {{id_area_fabrica_B}}, "nivel": 4},
          {"area": {{id_area_fabrica_C}}, "nivel": 2}
      ],
      "outras_tech": [
          {"nome": {{nome}} }
      ]
  }
  ```

#### Workshop


- **Endpoint:** `POST` `GET` `/api/workshop/`
- **Permissão:** Admins para escrita, autenticados para leitura
- **Corpo da Requisição (Criação/Atualização Completa):**
- **Lógica:** Envia-se `id_usuario` para vincular membros. Apenas `participantes` podem ser `participantes`, `participante` e `excecao` podem ser `instrutores`, caso já sejam `extensionista`. 

  ```json
  {
      "area": {{id_area}},
      "titulo": {{titulo}},
      "descricao": {{descricao}},
      "sala": {{sala}},
      "bloco": {{bloco}},
      "instrutores": [ {{id_usuario_A}}, {{id_usuario_B}}],
      "participantes": [{{id_usuario_C}}, {{id_usuario_D}}{{id_usuario_E}}, {{id_usuario_F}}],
      "dias_workshop": [
          "2025-08-10T14:00:00Z",
          "2025-08-17T14:00:00Z"
      ]
  }
  ```

- **Endpoint:** `GET` `PUT` `PATCH` `DELETE` `/api/workshop/{{od_workshop}}`
- **Permissão:** Admins para escrita, autenticados para leitura
- **Corpo da Requisição (Criação/Atualização Completa):**
- **Lógica:** Envia-se `id_usuario` para vincular membros. Apenas `participantes` podem ser `participantes`, `participante` e `excecao` podem ser `instrutores`, caso já sejam `extensionista`. 

  ```json
  {
      "area": {{id_area}},
      "titulo": {{titulo}},
      "descricao": {{descricao}},
      "sala": {{sala}},
      "bloco": {{bloco}},
      "instrutores": [ {{id_usuario_A}}, {{id_usuario_B}}],
      "participantes": [{{id_usuario_C}}, {{id_usuario_D}}{{id_usuario_E}}, {{id_usuario_F}}],
      "dias_workshop": [
          "2025-08-10T14:00:00Z",
          "2025-08-17T14:00:00Z"
      ]
  }
  ```

#### Presença em Workshop

- **Endpoint para registro individual:** `POST` `/api/presenca_workshop/`

  ```json
  {
      "dia_workshop": {{id_dia_workshop}},
      "usuario_id": {{id_usuario}}
  }
  ```

- **Endpoint para registro em massa:** `POST` `/api/presenca_workshop/bulk_create/`
- **Permissão:** Instrutores do workshop ou Admins
- **Corpo da Requisição:**

  ```json
  {
      "dia_workshop": {{id_dia_workshop}},
      "usuario_ids": [{{id_usuario_A}}, {{id_usuario_B}}]
  }
  ```

#### Desempenho em Workshop


- **Endpoint:** `GET` `POST` `/api/desempenho_workshop/`
- **Permissão:** Instrutores do workshop em questão ou Admins
- **Corpo da Requisição:**

  ```json
  {
      "usuario_id": {{id_usuario}},
      "workshop": {{id_workshop}},
      "desempenho": {{desempenho}},
      "comentario": {{comentario}},
      "especialidade": {{id_tecnologia}},
      "aprovado": bool,
      "classificacao": {{classificacao}},
      "experiencia": {{experiencia}}
  }
  ```

- **Endpoint:** `GET` `PUT` `PATCH` `DELETE` `/api/desempenho_workshop/`
- **Permissão:** Instrutores do workshop em questão ou Admins
- **Corpo da Requisição:**

  ```json
  {
      "usuario_id": {{id_usuario}},
      "workshop": {{id_workshop}},
      "desempenho": {{desempenho}},
      "comentario": {{comentario}},
      "especialidade": {{id_tecnologia}},
      "aprovado": bool,
      "classificacao": {{classificacao}},
      "experiencia": {{experiencia}}
  }
  ```

---

### Gerenciamento de Projetos

**Base URL:** `/api/projeto/`

Endpoints para criar e gerenciar projetos da fábrica.

#### Listar Projetos

- **Endpoint:** `GET /api/projeto/`
- **Permissão:** Autenticado
- **Lógica:** Retorna uma lista de projetos relevantes para o usuário (seja ele admin, techleader, cliente ou membro da equipe)

#### Visualizar um Projeto

- **Endpoint:** `GET /api/projeto/{{id}}/`
- **Permissão:** Autenticado
- **Lógica:** Se o usuário for admin, techleader ou cliente do projeto, retorna todos os detalhes. Caso seja apenas um membro da equipe, retorna uma visão simplificada.

#### Criar/Atualizar um Projeto

- **Endpoint:** `POST` `/api/projeto/`, `PUT /api/projeto/{{id}}/`
- **Permissão:** Admins para criar. Admins, Techleader ou Empresa do projeto para atualizar.
- **Corpo da Requisição:**

  ```json
  {
      "nome": {{nome}},
      "descricao": {{descricao}},
      "area": {{nome_area}},
      "data_prazo": "2025-12-20",
      "status": "ativo", # Opções: ativo | pausado | concluido | cancelado
      "etapa_atual": "planejamento", # Opções: planejamento | desenvolvimento | testes | implantacao | concluido
      "progresso": 10, # Opções: 0 - 100
      "empresa_usuario_id": {{id_usuario}},
      "techleader_usuario_id": {{id_usuario}},
      "equipe": [
          {
              "usuario_id": {{id_usuario}},
              "cargos_ids": [{{id_area}}],
              "status": "ativo" # Opções: ativo | inativo
          },
          {
              "usuario_id": {{id_usuario}},
              "cargos_ids": [{{id_area}}],
              "status": "ativo" # Opções: ativo | inativo
          }
      ]
  }
  ```

---

# Manual Painel Administrativo Fábrica de Software

Bem-vindo ao manual de usuário do painel administrativo da Fábrica de Software. Este guia foi criado para ajudar você a utilizar todas as ferramentas disponíveis de forma simples e eficiente, incluindo gerenciamento de usuários, projetos, workshops e configurações do sistema.

## Tabela de Conteúdos

1. [Configuração e Acesso](#configuração-e-acesso)
2. [Visão Geral do Painel](#visão-geral-do-painel)
3. [Dashboard (Tela Inicial)](#dashboard-tela-inicial)
4. [Funcionalidades do Sistema](#funcionalidades-do-sistema)
   - [Usuários](#usuários)
   - [Extensionistas](#extensionistas)
   - [Projetos](#projetos)
   - [Imersões e Palestras](#imersões-e-palestras)
   - [Workshops](#workshops)
   - [Configurações](#configurações)
5. [Permissões e Segurança](#permissões-e-segurança)
6. [Dicas e Boas Práticas](#dicas-e-boas-práticas)

---

## Configuração e Acesso

### Requisitos de Acesso

Para utilizar o painel administrativo, você precisa:

1. **Email autorizado:** Seu email deve estar cadastrado em uma das listas de permissão (Admins, Membros ou Participantes).
2. **Credenciais válidas:** Login e senha configurados no sistema.

### Primeiro Acesso

1. **Acesse o painel através do link fornecido**
2. **Faça login com suas credenciais**
3. **Verifique suas permissões de acesso**
4. **Familiarize-se com o menu lateral**

### Logout e Segurança

- O botão **Sair (Logout)** está sempre disponível no menu lateral
- Sempre faça logout ao finalizar o uso
- Sessões têm timeout automático por segurança

---

## Visão Geral do Painel

O painel administrativo é dividido em duas áreas principais:

### Menu Lateral (Sidebar)
Localizado à esquerda da tela, contém:
- Links para todas as seções do sistema
- Botão de logout
- Indicadores de seção ativa

### Área de Conteúdo
Ocupa a maior parte da tela e exibe:
- Informações e dados das seções
- Formulários para criação e edição
- Tabelas com listagens
- Dashboards e relatórios

---

## Dashboard (Tela Inicial)

A tela inicial oferece uma visão geral rápida dos números mais importantes do sistema:

### Métricas Principais

- **Total de Participantes:** Quantidade total de usuários cadastrados como participantes
- **Total de Projetos:** Número total de projetos criados na plataforma

---

## Funcionalidades do Sistema

### Usuários

Esta seção permite visualizar e gerenciar todos os usuários cadastrados no sistema, organizados por tipo.

#### Tipos de Usuários

- **Participantes:** Usuários base do sistema
- **Exceções:** Casos especiais de participantes
- **Empresas:** Clientes e parceiros
- **Tech Leaders:** Líderes técnicos responsáveis

#### Como Editar um Usuário

1. **Localize o usuário** na lista correspondente
2. **Clique no ícone de lápis** na coluna "Ações"
3. **Modifique as informações** na janela pop-up que se abrirá:
   - Nome
   - Telefone
   - Campos específicos (curso, período, CNPJ)
4. **Clique em "Salvar Alterações"** para confirmar

> **Importante:** O email do usuário (username) não pode ser alterado por questões de segurança.

### Extensionistas

Gerencia os usuários que têm o papel de Extensionista - alunos ou membros que podem ser alocados em projetos e workshops como parte da equipe.

#### Como Promover um Usuário a Extensionista

1. **Na caixa "Adicionar Extensionistas"**, visualize a lista de "Imersionistas"
2. **Selecione um ou mais usuários:**
   - Clique no nome do usuário
   - Para seleção múltipla: segure Ctrl (ou Cmd no Mac) e clique nos nomes ou arraste o cursor pelos nomes
3. **Clique em "Promover a Extensionista"**

#### Como Remover o Papel de Extensionista

1. **Na tabela "Extensionistas Atuais"**, encontre o usuário
2. **Clique no botão vermelho "Remover"** ao lado do nome
3. **Confirme a ação** na janela de aviso

> **Nota:** O usuário voltará a ser um imersionista, mas não será excluído do sistema.

### Projetos

Seção central para criação, edição e acompanhamento de todos os projetos da plataforma.

#### Como Criar um Novo Projeto

1. **Clique no botão verde "Novo Projeto"**
2. **Preencha as informações básicas:**
   - **Nome:** Título do projeto
   - **Área:** Categoria ou setor
   - **Prazo Final:** Data limite para conclusão
   - **Descrição:** Detalhes sobre o projeto
3. **Defina os responsáveis:**
   - **Empresa Cliente:** Selecione da lista
   - **Líder Técnico:** Opcional, se houver
4. **Monte a equipe:**
   - Clique em "Adicionar Membro"
   - Selecione um Extensionista disponível
   - Defina o Cargo (baseado nas "Áreas da Fábrica")
   - Repita para adicionar mais membros
5. **Clique em "Criar Projeto"**

#### Como Editar um Projeto

1. **Na lista de projetos**, clique no ícone "Editar Projeto"
2. **Modifique as informações necessárias:**
   - **Status:** Ativo, Pausado, Concluído
   - **Etapa Atual:** Planejamento, Desenvolvimento, etc.
   - **Progresso:** Porcentagem de conclusão
   - **Equipe:** Adicionar ou remover membros
3. **Clique em "Salvar Alterações"**

#### Como Excluir um Projeto

1. **Clique no ícone de lixeira** ao lado do projeto
2. **Confirme a exclusão** na janela de aviso

> **Atenção:** Esta ação não pode ser desfeita.

### Imersões e Palestras

Sistema para organizar grandes eventos ou ciclos de atividades, onde cada imersão pode conter várias palestras.

#### Como Criar uma Nova Imersão

1. **Clique no botão "Nova Imersão"**
2. **Escolha uma das opções:**
   - **Vincular a uma Iteração Existente:** Use um ciclo já cadastrado
   - **Criar Nova Iteração:** Para ciclos inexistentes, informe Ano e Semestre
3. **Clique em "Criar Imersão"**

#### Como Gerenciar Palestras de uma Imersão

1. **Na lista de imersões**, clique no botão "Palestras"
2. **Visualize as palestras** já cadastradas
3. **Para adicionar uma palestra:**
   - Preencha: Título, Palestrante, Data e Hora
   - Clique em "Adicionar"
4. **Para remover uma palestra:**
   - Clique no ícone ao lado da palestra

### Workshops

Gerenciamento de eventos de treinamento e capacitação, incluindo instrutores e participantes.

#### Como Criar um Novo Workshop

1. **Clique no botão "Novo Workshop"**
2. **Preencha o formulário:**
   - **Título:** Nome do workshop
   - **Área da Fábrica:** Categoria/tema
   - **Descrição:** Detalhes sobre o conteúdo
   - **Instrutor(es):** Selecione extensionistas
   - **Sala e Bloco:** Informações de localização
3. **Clique em "Criar Workshop"**

#### Como Gerenciar Instrutores

1. **Na lista de workshops**, clique em "Gerenciar Instrutores"
2. **Organize as listas:**
   - **Lista "Disponíveis"** → **Lista "Instrutores no Workshop"** (para adicionar)
   - **Lista "Instrutores no Workshop"** → **Lista "Disponíveis"** (para remover)
3. **Clique em "Salvar Alterações"**

#### Como Gerenciar Participantes

1. **Clique em "Gerenciar Participantes"**
2. **Organize as listas** da mesma forma que os instrutores
3. **Clique em "Salvar Alterações"**

### Configurações

Área crítica que afeta o funcionamento de todo o sistema. Alterações aqui impactam as opções disponíveis em outras seções.

#### Gerenciamento de Iterações

As **Iterações** representam ciclos da Fábrica de Software. Apenas uma iteração pode estar **Ativa** por vez.

##### Ativar uma Iteração
1. **Clique no botão "Ativar"** ao lado de um ciclo inativo
2. **A iteração anterior será desativada automaticamente**

##### Criar Nova Iteração
1. **Use o formulário "Nova Iteração"**
2. **Preencha:** Ano e Semestre
3. **Clique em "Criar"**

#### Itens Globais

Gerenciamento de **Áreas da Fábrica** e **Tecnologias** que aparecem como opções em projetos e workshops.

##### Adicionar Novo Item
1. **Digite o nome** no campo "Adicionar novo item..."
2. **Clique em "Adicionar"**

##### Gerenciar Items Existentes
- **Ativar/Desativar:** Use o interruptor na coluna "Status"
- **Excluir:** Clique no ícone

#### Listas de Acesso por Email

Controle de acesso através de três listas de permissão:

- **Admins:** Acesso completo ao sistema
- **Membros (Empresa/TL):** Acesso a recursos específicos
- **Participantes:** Acesso básico

##### Adicionar Emails
1. **Cole os emails** na caixa "Adicionar Emails"
2. **Formatos aceitos:** vírgula, espaço, ponto e vírgula, quebra de linha
3. **Clique em "Adicionar"**

##### Remover Emails
1. **Cole os emails** na caixa "Remover Emails"
2. **Clique em "Remover"**

---

## Permissões e Segurança

### Níveis de Acesso

| Nível | Descrição | Permissões |
|-------|-----------|------------|
| **Admin** | Administrador completo | Acesso total a todas as funcionalidades |
| **Empresa/TL** | Empresa ou Tech Leader | Visualização de projetos e gerenciamento limitado |
| **Participante** | Usuário básico | Acesso de visualização a informações específicas |

>Importante: Este painel é de uso exclusivo para Administradores. Outros usuários não terão acesso.

### Controle de Segurança

- **Autenticação obrigatória** para todas as operações
- **Baseado em listas de emails** configuradas nas configurações
- **Sessões com timeout automático** para segurança
- **Logs de atividade** para auditoria

---

## Dicas e Boas Práticas

### Uso Geral

1. **Sempre faça logout** ao finalizar o uso do sistema
2. **Verifique suas permissões** antes de tentar realizar operações
3. **Confirme dados importantes** antes de salvar alterações

### Gerenciamento de Projetos

1. **Mantenha equipes atualizadas** conforme mudanças no projeto
2. **Atualize o progresso regularmente** para acompanhamento
3. **Defina prazos realistas** ao criar projetos
4. **Use descrições detalhadas** para facilitar o entendimento


### Solução de Problemas

- **Problemas de acesso:** Verifique se seu email está na lista adequada
- **Erros de dados:** Confirme se todos os campos obrigatórios estão preenchidos
- **Funcionalidades indisponíveis:** Verifique seu nível de permissão

---

**Versão:** 1.0  
**Última atualização:** 2025  
**Suporte:** Entre em contato com a equipe técnica para dúvidas ou problemas

**Api, painel, documentação:** `pedrohffirmino@gmail.com`
