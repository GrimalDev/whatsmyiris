FROM node:18-buster

WORKDIR /home/node/app

COPY package*.json ./

RUN npm i -y

COPY . .