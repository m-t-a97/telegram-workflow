import { Api } from "telegram";

import { LoggerUtils } from "@shared-core";

import { TelegramAuthService } from "../auth/telegram-auth.service";
import { ITelegramChatsService } from "./i-telegram-chats.service";

import testChatsAsJson from "./test-chats.json";

export class TelegramChatsService implements ITelegramChatsService {
  constructor(private readonly telegramAuthService: TelegramAuthService) {}

  public async getAllChats(): Promise<Api.TypeChat[]> {
    try {
      // const client = this.telegramAuthService.getClient();

      // const chatResults: Api.messages.TypeChats = await client.invoke(
      //   new Api.messages.GetAllChats({ exceptIds: [] })
      // );

      // const chats = chatResults.chats;
      // return Promise.resolve(chats);

      return this.useTestChats();
    } catch (error) {
      LoggerUtils.error("TelegramChatsService", "getAllChats", error);

      return Promise.reject(error.message);
    }
  }

  // TODO: using for testing purposes
  private useTestChats(): Promise<any> {
    return Promise.resolve(testChatsAsJson);
  }
}
