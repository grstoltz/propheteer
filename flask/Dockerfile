FROM python:3.7-buster
WORKDIR /flask
ADD . .
# RUN apk add --no-cache --virtual .build-deps gcc musl-dev \
#     && pip install cython numpy\

RUN apt-get -y update  && apt-get install -y \
  gcc \
  python3-dev \
  libpng-dev \
  apt-utils \
  python-psycopg2 \
  python-dev \
  postgresql-client \
&& rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade setuptools
RUN pip install cython
RUN pip install pandas
RUN pip install numpy
RUN pip install matplotlib
RUN pip install pystan
RUN pip install fbprophet
RUN pip install psycopg2
RUN pip install sqlalchemy
RUN pip install flask

EXPOSE 8080

ENV FLASK_APP=main.py
ENV FLASK_DEBUG=1

CMD ["flask", "run", "-h", "0.0.0.0", "-p", "8080"]