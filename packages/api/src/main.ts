import { INestApplication, Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import _ from "lodash";

import configureModuleAliases from "./constants/module-alias";
import { AppModule } from "./modules/app.module";

configureModuleAliases();

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule, {
    cors: {
      methods: ["GET", "POST", "PUT", "DELETE"],
      origin: ["http://localhost:8080", "http://localhost:3000"],
    },
  });

  await app.listen(process.env.PORT || 8080);

  Logger.debug(
    `NODE ENVIRONMENT: ${
      _.isEqual(process.env.NODE_ENV, "production")
        ? "production"
        : "development"
    }`
  );

  Logger.debug(`The server is listening on: ${await app.getUrl()}`);
}

bootstrap();
