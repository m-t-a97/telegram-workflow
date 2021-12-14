# Telegram Workflow

A self hosted telegram automation app that allows you to create workflows to automate forwarding messages. Workflows consist of selecting a source chat and destination chats which are forwarded to.

## Setup

```bash
# Install lerna globally
$ npm i -g lerna

# Bootstrap all libs
$ yarn bootstrap
```

---

## Development

The best way to work during development is to run both the frontend and backend separately. Run the following commands in the respective folders:

`client`:

```bash
$ yarn serve
```

`api`:

```bash
$ yarn start:dev
```

---

## Production

During production, the client app will be built and then served by the NestJS API via static files. At the moment, this is a self hosted solution so the frontend is being served by the backend.

Run the following commands to run it in production mode:

`client`:

```bash
$ yarn build
```

`api`:

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
