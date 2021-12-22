# [BUILD]

FROM node:16-alpine AS builder

WORKDIR /app

RUN npm i -g lerna

COPY . ./

RUN yarn bootstrap && yarn build

# [RUN]

FROM node:16-alpine AS runner

WORKDIR /app

COPY --from=builder /app/packages/api/dist ./api/dist
COPY --from=builder /app/packages/api/prisma ./api/prisma
COPY --from=builder /app/packages/api/node_modules ./api/node_modules
COPY --from=builder /app/packages/api/package.json ./api/package.json
COPY --from=builder /app/packages/client/dist ./client/dist

WORKDIR /app/api

RUN yarn add tslib@2.3.1

ENV NODE_ENV production
ENV PORT ${PORT}

EXPOSE ${PORT}

CMD [ "yarn", "migrate:start:prod" ]
