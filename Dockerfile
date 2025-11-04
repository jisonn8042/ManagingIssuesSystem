FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY server/. .

COPY Presentation/. .

WORKDIR /usr/src/app/server

EXPOSE 5500

CMD ["node", "api.js"]
