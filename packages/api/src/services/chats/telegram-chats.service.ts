import { Injectable } from "@nestjs/common";

import { Api } from "telegram";

import { AbstractTelegramAuthService } from "../auth/abstract-telegram-auth.service";
import { AbstractChatsService } from "./abstract-chats.service";

@Injectable()
export class TelegramChatsService extends AbstractChatsService {
  constructor(
    private readonly telegramAuthService: AbstractTelegramAuthService
  ) {
    super();
  }

  public async fetchChats(): Promise<Api.TypeChat[]> {
    const client = this.telegramAuthService.getClient();

    const chatResults: Api.messages.TypeChats = await client.invoke(
      new Api.messages.GetAllChats({ exceptIds: [] })
    );

    const chats = chatResults.chats;

    return Promise.resolve(chats);
  }
}
