import { Controller, Get } from "@nestjs/common";

import { AbstractChatsService } from "src/services/chats/abstract-chats.service";

@Controller("chats")
export class TelegramChatsController {
  constructor(private readonly chatsService: AbstractChatsService) {}

  @Get()
  public async fetchChats(): Promise<any> {
    return this.chatsService.fetchChats();
  }
}
