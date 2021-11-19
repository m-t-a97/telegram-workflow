import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";

import { ChatAutomation } from "@autogram/shared-core";

import { AbstractChatAutomationService } from "src/services/chat-automations/abstract-chat-automation.service";

@Controller("api/chat-automations")
export class ChatAutomationsController {
  constructor(
    private readonly chatAutomationService: AbstractChatAutomationService
  ) {}

  @Get("/create")
  public async create(): Promise<{ uid: string }> {
    return this.chatAutomationService.create();
  }

  @Get("/")
  public async getAll(): Promise<ChatAutomation[]> {
    return this.chatAutomationService.getAll();
  }

  @Get("/:id")
  public async get(@Param("id") id: string): Promise<ChatAutomation | null> {
    return this.chatAutomationService.get(id);
  }

  @Put("/:id")
  public async update(
    @Param("id") id: string,
    @Body() chatAutomation: Partial<ChatAutomation>
  ): Promise<void> {
    return this.chatAutomationService.update(id, chatAutomation);
  }

  @Delete("/:id")
  public async delete(@Param("id") id: string): Promise<void> {
    return this.chatAutomationService.delete(id);
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
