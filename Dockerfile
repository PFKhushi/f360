FROM python:3.13-slim

LABEL maintainer="pedrohffirmino@gmail.com"

ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -r django && useradd -r -g django django-user

WORKDIR /projeto

COPY ./requirements.txt /tmp/requirements.txt
RUN pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt && \
    rm -rf /tmp

COPY ./projeto .

RUN chown -R django-user:django /projeto

USER django-user

EXPOSE 8000

CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]

