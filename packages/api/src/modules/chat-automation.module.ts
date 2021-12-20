import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";

import { TelegramChatAutomationsController } from "src/controllers/chat-automations/telegram-chat-automations.controller";
import { ApiKeyVerificationMiddleware } from "src/middleware/api-key-verification.middleware";
import { AbstractTelegramChatAutomationsDaoService } from "src/services/chat-automations/abstract-telegram-chat-automations-dao.service";
import { AbstractTelegramChatAutomationsHandlerService } from "src/services/chat-automations/abstract-telegram-chat-automations-handler.service";
import { TelegramChatAutomationsDaoService } from "src/services/chat-automations/telegram-chat-automations-dao.service";
import { TelegramChatAutomationsHandlerService } from "src/services/chat-automations/telegram-chat-automations-handler.service";

@Module({
  exports: [
    AbstractTelegramChatAutomationsDaoService,
    AbstractTelegramChatAutomationsHandlerService,
  ],
  controllers: [TelegramChatAutomationsController],
  providers: [
    {
      provide: AbstractTelegramChatAutomationsDaoService,
      useClass: TelegramChatAutomationsDaoService,
    },
    {
      provide: AbstractTelegramChatAutomationsHandlerService,
      useClass: TelegramChatAutomationsHandlerService,
    },
  ],
})
export class ChatAutomationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyVerificationMiddleware)
      .forRoutes(TelegramChatAutomationsController);
  }
}
