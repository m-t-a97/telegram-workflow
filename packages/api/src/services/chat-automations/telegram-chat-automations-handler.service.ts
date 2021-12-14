import { Logger } from "@nestjs/common";

import { NewMessage, NewMessageEvent } from "telegram/events";

import { ChatAutomation } from "@/shared-core";

import { AbstractTelegramAuthService } from "../auth/abstract-telegram-auth.service";
import { AbstractTelegramChatAutomationsHandlerService } from "./abstract-telegram-chat-automations-handler.service";

export class TelegramChatAutomationsHandlerService extends AbstractTelegramChatAutomationsHandlerService {
  constructor(
    private readonly telegramAuthService: AbstractTelegramAuthService
  ) {
    super();
  }

  public async activate(chatAutomation: ChatAutomation): Promise<any> {
    try {
      console.log(chatAutomation);

      // await this.queue.add(constants.queue.chatAutomationJobKey, {
      //   id: userId,
      //   chatAutomation: data.chatAutomation,
      // });

      return {
        message: `Added new chat automation`,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async deactivate(id: string): Promise<any> {
    // delete this.chatAutomationsUserMap[userId]?.automations[
    //   data.chatAutomation.id
    // ];
    // LoggerUtils.log(
    //   "TelegramChatAutomationService",
    //   "deactivate",
    //   this.chatAutomationsUserMap[userId]
    // );
  }

  public subscribeToNewMessageEventHandler(): void {
    try {
      this.telegramAuthService
        .getClient()
        .addEventHandler(this.messageEventCallback, new NewMessage({}));
    } catch (error) {
      Logger.error(
        error.message,
        "TelegramChatAutomationsHandlerService:subscribeToNewMessageEventHandler"
      );
    }
  }

  public unsubscribeFromNewMessageEventHandler(): void {
    this.telegramAuthService
      .getClient()
      .removeEventHandler(this.messageEventCallback, new NewMessage({}));
  }

  private messageEventCallback(event: NewMessageEvent): void {
    console.log(event);
  }

  public executeChatAutomation(chatAutomation: ChatAutomation): Promise<void> {
    return null;
  }
}
