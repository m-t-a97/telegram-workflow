FROM node:14

WORKDIR /app

COPY package.json ./

RUN npm i -g lerna

COPY . ./

CMD [ "yarn", "run:prod" ]
