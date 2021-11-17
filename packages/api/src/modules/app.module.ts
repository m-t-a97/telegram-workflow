import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";

import path from "path";
import _ from "lodash";

import { AppController } from "../controllers/app.controller";
import { AppService } from "../services/app.service";
import { ChatAutomationsModule } from "./chat-automation.module";
import { AuthModule } from "./auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
      envFilePath: [
        ".env.local",
        ".env",
        !_.isEqual(process.env.NODE_ENV, "production")
          ? ".env.development"
          : ".env.production",
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, "../../../../../", "client/dist"),
    }),
    AuthModule,
    ChatAutomationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
