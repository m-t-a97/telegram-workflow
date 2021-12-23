# Telegram Workflow

A self hosted telegram automation app that allows you to create workflows to automate forwarding messages. Workflows consist of selecting a source chat and destination chats which are forwarded to.

---

## Deployment

<a href="https://heroku.com/deploy?template=https://github.com/m-t-a97/telegram-workflow">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>

<br />

<span style="color: red">NOTE:</span> Once the app is deployed, add a `Heroku Postgres` add-on.

---

## Setup

```bash
# Install lerna globally
$ npm i -g lerna

# Bootstrap all libs
$ yarn bootstrap
```

---

## Development

### Order of imports:

Organise the order of imports in files to make it more readable and understandable at first glance what's being used.

`client`:

- Framework (VueJS e.g. `vue`)

- Third party (npm libraries e.g. `lodash, axios, vuestic-ui` etc)

- First party (project libraries e.g. `@shared-core`)

- Current project's source code (e.g. `@/components/ ./some-folder ./some-file`)

`api`:

- Framework (Nestjs e.g. `@nestjs/common`)

- Third party (npm libraries e.g. `lodash` etc)

- First party (project libraries e.g. `@/shared-core`)

- Current project's source code (e.g. `./some-folder ./some-file`)

You have two options you can use for developing:

- develop inside of a container using Remote-Containers
- docker-compose

### Devcontainers

Using VSCode, run the command `Remote-Containers: Open Folder in Container...` which will spin up a remote container with all the necessary extensions required for you to develop inside of the container along with the source code.

### Docker Compose

`Development`:

```bash
# Runs docker compose in development mode
$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# To view the config of your running docker compose setup
$ docker-compose config

# To stop the docker compose services
$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml stop

# To remove the docker compose services along with any volume mounts
$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v
```

`Production`:

```bash
# Runs docker compose in production mode.
$ docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# To view the config of your running docker compose setup
$ docker-compose config

# To stop the docker compose services
$ docker-compose -f docker-compose.yml -f docker-compose.prod.yml stop

# To remove the docker compose services along with any volume mounts
$ docker-compose -f docker-compose.yml -f docker-compose.prod.yml down -v
```

---

## Git & Github

You should name your branches based on the number of your issue on Github e.g. `TW-1`. This would refer to an acronym of the project name `TelegramWorkflow-1`. This way everyone would know which branch your issue refers to.

Don't forget to follow this guide:

[Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)

---

## Extra notes

Contributions are most welcome :)

Fork the repo and create some PRs to improve the code / add more features. If you want to add features, first create a discussion on Github about it.

If you've encountered any bugs, please raise issues and then fix them once you are assigned.

Thank you for your contributions and have fun!

---

## Terms of Use

[Heroku](https://www.heroku.com/policy/heroku-elements-terms)

---
