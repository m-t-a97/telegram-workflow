# ---------------------------------
# BUILD STAGE
# ---------------------------------
FROM node:16-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory
WORKDIR /app

RUN yarn global add turbo

COPY . .

RUN turbo prune --scope=webapp --docker
# ---------------------------------

# ---------------------------------
# INSTALL STAGE
# ---------------------------------
# Add lockfile and package.json's of isolated subworkspace
FROM node:16-alpine AS installer

RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run build --filter=webapp...
# ---------------------------------

# ---------------------------------
# RUNNER STAGE
# ---------------------------------
FROM nginx:1.23-alpine as runner

WORKDIR /app

RUN rm -rf /usr/share/nginx/html/*
COPY ../../nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=installer /app/apps/webapp/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
