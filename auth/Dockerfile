FROM node:alpine

WORKDIR /usr/app

COPY ./package.json ./

RUN yarn install --production=true

COPY ./ ./

CMD ["npm", "start"]