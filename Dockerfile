FROM node:16.14-alpine

LABEL author="ritik singla"

ENV PORT=5000

WORKDIR /usr/app
COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .
EXPOSE $PORT
CMD ["nodemon", "-L", "src/app.js"]