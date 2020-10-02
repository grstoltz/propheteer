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