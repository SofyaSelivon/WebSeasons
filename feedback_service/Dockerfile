FROM python:3.12

WORKDIR /app
COPY . /app

RUN pip install --upgrade pip
RUN pip install django psycopg2-binary django-cors-headers requests

EXPOSE 8002

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
