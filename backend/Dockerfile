FROM node:18-alpine

WORKDIR /backend/src/app

COPY package*.json ./
COPY .env /app/.env

RUN npm cache clean --force
RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm", "run", "start" ]