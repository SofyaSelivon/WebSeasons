FROM python:3.12

WORKDIR /app
COPY . /app

RUN pip install --upgrade pip
RUN pip install django channels daphne requests pillow psycopg2-binary

RUN python manage.py collectstatic --noinput
RUN python manage.py migrate

EXPOSE 8000

CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "seasons_project.asgi:application"]
