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

RUN turbo prune --scope=api --docker
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

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run build --filter=api...
# ---------------------------------

# ---------------------------------
# RUNNER STAGE
# ---------------------------------
FROM node:16-alpine AS runner

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=installer /app .

EXPOSE ${PORT}

CMD node apps/api/dist/apps/api/src/main.js
