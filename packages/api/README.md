<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# Telegram Workflow API

## Installation

```bash
yarn install
```

---

## Environment Variables

Create a `.env.local` file and add the following variables to it. This file is used to store secret variables.

```bash
PORT=<value>

# User generated unique auth key
AUTH_KEY=<value>

# Telegram API ID
API_ID=<value>
# Telegram API HASH
API_HASH=<value>
```

Create a `.env.development` file and add the following variables to it. This file is used to store non-secret variables.

```bash
# if on WSL2 and using docker, make the IP address "host.docker.internal".
HOST=<value>
PORT=<value>
```

---

## Running the app

```bash
# development
yarn start

# watch mode
yarn start:dev

# production mode
yarn start:prod
```

---

## Test

```bash
# unit tests
yarn test

# e2e tests
yarn test:e2e

# test coverage
yarn test:cov
```

---

## Using the Firebase Emulator

The Firebase Admin SDK automatically connects to the emulator when the following environment variables are set:

```bash
# If using WSL2 and Docker use `host.docker.internal` as the IP address
export FIREBASE_AUTH_EMULATOR_HOST="host.docker.internal:<port>"
export FIRESTORE_EMULATOR_HOST="host.docker.internal:<port>"
export FIREBASE_STORAGE_EMULATOR_HOST="host.docker.internal:<port>"

# else use localhost
export FIREBASE_AUTH_EMULATOR_HOST="localhost:<port>"
export FIRESTORE_EMULATOR_HOST="localhost:<port>"
export FIREBASE_STORAGE_EMULATOR_HOST="localhost:<port>"
```

---

## Issues

If the server doesn't build and has errors. Try the following procedures:

- Remove node_modules then `yarn install`
- Run the command `yarn prebuild` then start the server again

---
