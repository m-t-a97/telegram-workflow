<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# Telegram Workflow API

## Installation

```bash
$ yarn install
```

---

## Environment Variables

Create a `.env.local` file and add the following variables to it. This file is used to store secret variables.

```bash
# The port to run the server on
PORT=<value>

# User generated unique API key
API_KEY=<value>

# Telegram API ID
API_ID=<value>

# Telegram API HASH
API_HASH=<value>
```

---

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

---

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

---

# Prisma

```bash
# Re-run the prisma generate command after every change that's made to your Prisma schema to update the generated Prisma Client code
$ npx prisma generate

# Run the initial migration to map the data models to the database schema and generate the migration files.
$ npx prisma migrate dev --name init

# Deploys the current prisma schema to the database by creating the database and tables needed.
$ npx prisma migrate deploy
```

---
