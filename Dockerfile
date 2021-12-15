# Build stage

FROM node:14-alpine AS builder
WORKDIR /app
RUN npm i -g lerna
COPY . ./
RUN yarn bootstrap && yarn build

# Run stage

FROM node:14-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/packages/api/dist ./app/api/dist
COPY --from=builder /app/packages/client/dist ./app/client/dist

ENV PORT $PORT

EXPOSE $PORT

CMD [ "yarn", "start:prod" ]
