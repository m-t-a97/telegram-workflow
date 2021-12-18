# Telegram Workflow

A self hosted telegram automation app that allows you to create workflows to automate forwarding messages. Workflows consist of selecting a source chat and destination chats which are forwarded to.

---

## Deployment

<a href="https://heroku.com/deploy?template=https://github.com/m-t-a97/telegram-workflow">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>

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

The best way to work during development is to run both the frontend and backend separately. Run the following commands in the respective folders:

`packages/client`:

```bash
$ yarn serve
```

`packages/api`:

```bash
$ yarn start:dev
```

---

## Production

During production, the client app will be built and then served by the NestJS API via a static directory.

Run the following commands in the root of the project to run it in production mode:

```bash
$ export NODE_ENV=production
$ yarn run:prod
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
