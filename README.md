# Telegram Workflow

A self hosted telegram automation app that allows you to create workflows to automate forwarding messages. Workflows consist of selecting a source chat and destination chats which are forwarded to.

---

## Setup

```bash
# Install packages
$ yarn install
```

---

### Devcontainers

Using VSCode, run the command `Remote-Containers: Open Folder in Container...` which will spin up a remote container with all the necessary extensions required for you to develop inside of the container along with the source code.

### Local Development

```bash
# First spin up a local postgres container
$ docker run -itd --rm -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=telegramworkflowdb --name telegram-workflow-postgres postgres:15-alpine

# Navigate to the api folder and run the following npm command
$ npx prisma migrate deploy

# Then run the following command from the root of the project
$ yarn dev
```

### Docker Compose

`Development`:

```bash
# Runs docker compose in development mode
$ docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v && docker compose -f docker-compose.yml -f docker-compose.dev.yml build && docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# To view the config of your running docker compose setup
$ docker compose config

# To stop the docker compose services
$ docker compose -f docker-compose.yml -f docker-compose.dev.yml stop

# To remove the docker compose services along with any volume mounts
$ docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v
```

`Production`:

```bash
# Runs docker compose in production mode.
$ docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# To view the config of your running docker compose setup
$ docker compose config

# To stop the docker compose services
$ docker compose -f docker-compose.yml -f docker-compose.prod.yml stop

# To remove the docker compose services along with any volume mounts
$ docker compose -f docker-compose.yml -f docker-compose.prod.yml down -v
```

---
