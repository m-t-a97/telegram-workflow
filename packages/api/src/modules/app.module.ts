import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";

import path from "path";
import _ from "lodash";

import { ChatAutomationsModule } from "./chat-automation.module";
import { AuthModule } from "./auth.module";
import { ChatsModule } from "./chats.module";

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
    AuthModule,
    ChatsModule,
    ChatAutomationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
