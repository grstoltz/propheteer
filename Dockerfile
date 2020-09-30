# Setup and build the client

FROM node:14 as client

WORKDIR /usr/app/client/
COPY client/package*.json ./
RUN npm install -qy
COPY client/ ./
RUN npm run build


# Setup the server

FROM node:14
WORKDIR /usr/app/
COPY --from=client /usr/app/client/build/ ./client/build/

WORKDIR /usr/app/server/
COPY server/package.json ./
COPY server/yarn.lock ./

RUN yarn

COPY server/ ./
COPY server/.env.production .env

RUN yarn build

ENV NODE_ENV production

ENV PORT 8000

EXPOSE 8000
CMD [ "node", "dist/index.js" ]
USER node