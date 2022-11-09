import { INestApplication, Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { isEqual } from "lodash";

import { AppModule } from "./modules/app.module";

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.setGlobalPrefix("/api");
  await app.listen(process.env.PORT || 8080);

  Logger.debug(
    `NODE ENVIRONMENT: ${
      isEqual(process.env.NODE_ENV, "production") ? "production" : "development"
    }`
  );

  Logger.debug(`The server is listening on: ${await app.getUrl()}`);
}

bootstrap();
