import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";

import path from "path";

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
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, "../../../", "webapp/dist"),
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
