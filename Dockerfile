# Especifica a imagem base para construção da imagem docker
FROM python:3.12-slim

# Mentenedores, metadado
LABEL maintainer=""

# Define a variável de ambiente PYTHONUNBUFFERED para que a saída do Python não seja armazenada em buffer (melhora o log)
ENV PYTHONUNBUFFERED 1

# Copia Origem->Destino
COPY ./requirements.txt /tmp/requirements.txt
COPY ./projeto /projeto

# Define o dir de trabalho dentro do container
WORKDIR /Projeto
# Expõe a porta padrão do Django
EXPOSE 8000

# Executa um conjunto de comandos no container:
# 1. Cria um ambiente virtual python em /py.
# 2. Atualiza o pip.
# 3. Instala as dependências listadas.
# 4. Remove o diretório tmp.
# 5. Cria um usuário "django-user" sem senha e sem diretório pessoal que será usado para executar o aplicativo (não root).
RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip &&\
    /py/bin/pip install -r /tmp/requirements.txt &&\
    rm -rf /tmp && \
    adduser \
        --disabled-password \
        --no-create-home \
        django-user

# Adiciona bin ao PATH, para q oss executáveis do ambiente virtual possam ser chamados diretamente        
ENV PATH="/py/bin:$PATH"

# Altera o usuário do container para "django-user", para garantir que o aplicativo seja executado com permissões limitadas (boa prática de segurança)
USER django-user