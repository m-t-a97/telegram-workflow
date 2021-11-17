import { Body, Controller, Get, Post, Query } from "@nestjs/common";

import { ChatAutomation } from "@autogram/shared-core";

import { AbstractChatAutomationService } from "src/services/chat-automations/abstract-chat-automation.service";

@Controller("api/chat-automations")
export class ChatAutomationsController {
  constructor(
    private readonly chatAutomationService: AbstractChatAutomationService
  ) {}

  @Get("/")
  public async getChatAutomations(): Promise<ChatAutomation[]> {
    return Promise.resolve([]);
  }

  @Get("/:id")
  public async getChatAutomation(
    @Query("id") id: string
  ): Promise<ChatAutomation> {
    return Promise.resolve(null);
  }

  @Post("/activate")
  public async activate(
    @Body()
    data: {
      idToken: string;
      telegramSessionKey: string;
      chatAutomation: ChatAutomation;
    }
  ): Promise<any> {
    return this.chatAutomationService.activate(data);
  }

  @Post("/deactivate")
  public async deactivate(
    @Body() data: { idToken: string; chatAutomation: ChatAutomation }
  ): Promise<any> {
    return this.chatAutomationService.deactivate(data);
  }
}
