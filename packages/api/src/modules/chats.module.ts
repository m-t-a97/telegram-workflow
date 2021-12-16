import { Module } from "@nestjs/common";

import { TelegramChatsController } from "src/controllers/chats/telegram-chats.controller";
import { AbstractChatsService } from "src/services/chats/abstract-chats.service";
import { TelegramChatsService } from "src/services/chats/telegram-chats.service";
import { AuthModule } from "./auth.module";

@Module({
  imports: [AuthModule],
  controllers: [TelegramChatsController],
  providers: [
    {
      provide: AbstractChatsService,
      useClass: TelegramChatsService,
    },
  ],
})
export class ChatsModule {}
