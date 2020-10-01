FROM python:3.8-slim-buster
WORKDIR /flask
ADD ./flask .
# RUN apk add --no-cache --virtual .build-deps gcc musl-dev \
#     && pip install cython numpy\
RUN pip install --upgrade pip
RUN pip install cython numpy pandas convertdate && rm -rf /root/.cache/pip
RUN pip install pystan && rm -rf /root/.cache/pip
RUN pip install -r requirements.txt && rm -rf /root/.cache/pip
EXPOSE 5000
CMD ["flask", "run", "-h", "0.0.0.0", "-p", "5000"]

# Setup and build the client
FROM node:14.11 as client
WORKDIR /usr/app/client/
COPY client/package*.json .
RUN npm install -
COPY client/ .
RUN npm run build
# Setup the server

FROM node:14.11
WORKDIR /usr/app/
COPY --from=client /usr/app/client/build/ ./client/build/

WORKDIR /usr/app/server/
COPY server/package.json .
COPY server/yarn.lock .

RUN yarn

COPY server/ .
COPY server/.env.production .env

RUN yarn build

EXPOSE 4000
CMD [ "node", "dist/src/index.js" ]
USER node