import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";

import { AuthModule } from "./auth.module";
import { TelegramChatsController } from "src/controllers/chats/telegram-chats.controller";
import { ApiKeyVerificationMiddleware } from "src/middleware/api-key-verification.middleware";
import { AbstractChatsService } from "src/services/chats/abstract-chats.service";
import { TelegramChatsService } from "src/services/chats/telegram-chats.service";

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
export class ChatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyVerificationMiddleware)
      .forRoutes(TelegramChatsController);
  }
}
