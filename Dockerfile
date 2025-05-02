FROM python:3.13-slim

LABEL maintainer="pedrohffirmino@gmail.com"

ENV PYTHONUNBUFFERED=1

# Instala dependências do sistema (incluindo adduser)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    build-essential \
    libpq-dev \
    adduser \
    && rm -rf /var/lib/apt/lists/*

# Copia arquivos necessários
COPY ./requirements.txt /tmp/requirements.txt
COPY ./projeto /projeto

WORKDIR /projeto
EXPOSE 8000

# Cria e prepara ambiente virtual
RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    /py/bin/pip install -r /tmp/requirements.txt && \
    rm -rf /tmp

ENV PATH="/py/bin:$PATH"

# Cria usuário seguro para rodar o app
RUN adduser --disabled-password --no-create-home django-user

USER django-user

CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
