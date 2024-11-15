FROM node:20

WORKDIR /usr/src/app/placenet-app

COPY package*.json ./

RUN npm install && npm install axios

EXPOSE 8081

CMD ["npx", "expo", "start"]

