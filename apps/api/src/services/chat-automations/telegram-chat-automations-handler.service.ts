import { Injectable, Logger } from "@nestjs/common";

import _ from "lodash";
import { NewMessage, NewMessageEvent } from "telegram/events";
import { Api, TelegramClient } from "telegram";

import { ChatAutomation } from "@/shared-core";

import { AbstractTelegramChatAutomationsHandlerService } from "./abstract-telegram-chat-automations-handler.service";
import { AbstractTelegramChatAutomationsDaoService } from "./abstract-telegram-chat-automations-dao.service";

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
        async (event: NewMessageEvent) =>
          await this.messageEventCallback(event, client),
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
      async (event: NewMessageEvent) =>
        await this.messageEventCallback(event, client),
      new NewMessage({})
    );
  }

  private async messageEventCallback(
    event: NewMessageEvent,
    client: TelegramClient
  ): Promise<void> {
    try {
      const chatAutomations: ChatAutomation[] =
        await this.telegramChatAutomationsDaoService.getAll();

      const chatId: string = this.getChatID(event);

      for (let i = 0; i < chatAutomations.length; i++) {
        const chatAutomation: ChatAutomation = chatAutomations[i];

        if (!chatAutomation.active) {
          continue;
        }

        if (_.isEqual(chatAutomation.sourceChatId, chatId)) {
          const forwardMessages: Promise<Api.Message>[] = [];

          chatAutomation.destinationChatIds.forEach(
            async (destChatId: string) => {
              const isMessageMediaAWebpage = _.isEqual(
                event.message.media?.className.toLowerCase(),
                "MessageMediaWebPage".toLowerCase()
              );

              forwardMessages.push(
                client.sendMessage(destChatId, {
                  message: event.message.message,
                  file: isMessageMediaAWebpage ? null : event.message.media,
                })
              );
            }
          );

          await Promise.all(forwardMessages);

          break;
        }
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
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
