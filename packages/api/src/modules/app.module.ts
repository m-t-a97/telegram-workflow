import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";

import path from "path";
import _ from "lodash";

import { DbModule } from "./db.module";
import { AuthModule } from "./auth.module";
import { ChatsModule } from "./chats.module";
import { ChatAutomationsModule } from "./chat-automation.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
      envFilePath: ".env.local",
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, "../../../../../", "client/dist"),
    }),
    DbModule,
    AuthModule,
    ChatsModule,
    ChatAutomationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
