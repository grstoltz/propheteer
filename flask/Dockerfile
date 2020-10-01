FROM python:3.6.1-alpine
WORKDIR /flask
ADD . .
RUN apk add --no-cache --virtual .build-deps gcc musl-dev \
    && pip install cython \
    && apk del .build-deps
RUN pip install -r requirements.txt
CMD ["python","app.py"]