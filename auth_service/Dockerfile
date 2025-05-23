FROM python:3.12

WORKDIR /app
COPY . /app

RUN pip install --upgrade pip
RUN pip install django psycopg2-binary django-cors-headers dj-database-url gunicorn

ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["sh", "-c", "gunicorn auth_project.wsgi:application --bind 0.0.0.0:$PORT"]
