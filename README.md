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

- Framework (Nestjs e.g. @nestjs/common)

- Third party (npm libraries e.g. lodash, luxon etc)

- First party (project libraries e.g. @shared-core)

- Current project's source code (e.g. @/components/ ./some-folder or ./some-file)

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

During production, the client app will be built and then served by the NestJS API via a static directory. At the moment, this is a self hosted solution so the frontend is being served by the backend.

Run the following commands to run it in production mode:

`packages/client`:

```bash
$ yarn build
```

`packages/api`:

```bash
$ export NODE_ENV=production
$ yarn build
$ yarn start:prod
```

---

## Extra notes

Contributions are most welcome :)

Fork the repo and create some PRs to improve the code / add more features. If you want to add features, first create a discussion on Github about it.

If you've encountered any bugs, please raise issues and then fix them once you are assigned.

Thank you for your contributions and have fun.

---

## Terms of Use

[Heroku](https://www.heroku.com/policy/heroku-elements-terms)

---
