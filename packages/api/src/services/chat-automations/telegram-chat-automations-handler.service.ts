import { Injectable, Logger } from "@nestjs/common";

import _ from "lodash";
import { NewMessage, NewMessageEvent } from "telegram/events";
import { Api, TelegramClient } from "telegram";

import { AbstractTelegramChatAutomationsHandlerService } from "./abstract-telegram-chat-automations-handler.service";
import { AbstractTelegramChatAutomationsDaoService } from "./abstract-telegram-chat-automations-dao.service";
import { ChatAutomation } from "../../../../shared-core/src/models";

@Injectable()
export class TelegramChatAutomationsHandlerService extends AbstractTelegramChatAutomationsHandlerService {
  constructor(
    private readonly telegramChatAutomationsDaoService: AbstractTelegramChatAutomationsDaoService
  ) {
    super();
  }

  public subscribeToNewMessageEventHandler(client: TelegramClient): void {
    try {
      client.addEventHandler(
        (event: NewMessageEvent) => this.messageEventCallback(event, client),
        new NewMessage({})
      );
    } catch (error) {
      Logger.error(
        error.message,
        "TelegramChatAutomationsHandlerService:subscribeToNewMessageEventHandler"
      );
    }
  }

  public unsubscribeFromNewMessageEventHandler(client: TelegramClient): void {
    client.removeEventHandler(
      (event: NewMessageEvent) => this.messageEventCallback(event, client),
      new NewMessage({})
    );
  }

  private messageEventCallback(
    event: NewMessageEvent,
    client: TelegramClient
  ): void {
    const chatAutomations: ChatAutomation[] =
      this.telegramChatAutomationsDaoService.chatAutomations;

    const chatId: string = this.getChatID(event);

    for (let i = 0; i < chatAutomations.length; i++) {
      const chatAutomation: ChatAutomation = chatAutomations[i];

      if (!chatAutomation.active) {
        continue;
      }

      if (_.isEqual(chatAutomation.sourceChatId, parseInt(chatId))) {
        chatAutomation.destinationChatIds.forEach((destChatId: number) => {
          client.sendMessage(destChatId, { message: event.message.message });
        });

        break;
      }
    }
  }

  private getChatID(event: NewMessageEvent): string {
    let chatId: string;

    if (!_.isNil((event.message.peerId as Api.PeerChat).chatId)) {
      chatId = `-${(event.message.peerId as Api.PeerChat).chatId.toString()}`;
    } else if (!_.isNil((event.message.peerId as Api.PeerChannel).channelId)) {
      chatId = `-100${(
        event.message.peerId as Api.PeerChannel
      ).channelId.toString()}`;
    }

    return chatId;
  }
}
