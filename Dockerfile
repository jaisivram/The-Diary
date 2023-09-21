# Use an official Node.js runtime as a parent image
FROM node:20.3.1

WORKDIR /app

COPY .  .

RUN npm install

EXPOSE 443

CMD [ "node", "server.js" ]

