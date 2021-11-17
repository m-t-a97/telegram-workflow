import { Module } from "@nestjs/common";

import { ChatAutomationsController } from "src/controllers/chat-automations/chat-automations.controller";
import { AbstractChatAutomationService } from "src/services/chat-automations/abstract-chat-automation.service";
import { TelegramChatAutomationService } from "src/services/chat-automations/telegram-chat-automation.service";

@Module({
  imports: [],
  controllers: [ChatAutomationsController],
  providers: [
    {
      provide: AbstractChatAutomationService,
      useClass: TelegramChatAutomationService,
    },
  ],
})
export class ChatAutomationsModule {}
