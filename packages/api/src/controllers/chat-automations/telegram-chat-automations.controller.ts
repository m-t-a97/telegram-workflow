import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";

import _ from "lodash";

import { ChatAutomation } from "@/shared-core";

import { AbstractTelegramChatAutomationsDaoService as AbstractTelegramChatAutomationsDaoService } from "src/services/chat-automations/abstract-telegram-chat-automations-dao.service";
import { AbstractTelegramChatAutomationsHandlerService } from "src/services/chat-automations/abstract-telegram-chat-automations-handler.service";

@Controller("api/chat-automations")
export class TelegramChatAutomationsController {
  constructor(
    private readonly telegramChatAutomationsDaoService: AbstractTelegramChatAutomationsDaoService,
    private readonly telegramChatAutomationsHandlerService: AbstractTelegramChatAutomationsHandlerService
  ) {}

  @Get("create")
  public async create(): Promise<{ id: string }> {
    return this.telegramChatAutomationsDaoService.create();
  }

  @Get()
  public async getAll(): Promise<ChatAutomation[]> {
    return this.telegramChatAutomationsDaoService.getAll();
  }

  @Get(":id")
  public async get(@Param("id") id: string): Promise<ChatAutomation | null> {
    return this.telegramChatAutomationsDaoService.get(id);
  }

  @Put(":id")
  public async update(
    @Param("id") id: string,
    @Body() chatAutomation: Partial<ChatAutomation>
  ): Promise<void> {
    const existingChatAutomation =
      await this.telegramChatAutomationsDaoService.get(id);

    if (_.isNil(existingChatAutomation)) {
      return Promise.reject("A chat automation with this ID was not found.");
    }

    return this.telegramChatAutomationsDaoService.update(id, chatAutomation);
  }

  @Delete(":id")
  public async delete(@Param("id") id: string): Promise<void> {
    const existingChatAutomation =
      await this.telegramChatAutomationsDaoService.get(id);

    if (_.isNil(existingChatAutomation)) {
      return Promise.reject("A chat automation with this ID was not found.");
    }

    return this.telegramChatAutomationsDaoService.delete(id);
  }

  @Post("activate")
  public async activate(@Body() chatAutomation: ChatAutomation): Promise<any> {
    return this.telegramChatAutomationsHandlerService.activate(chatAutomation);
  }

  @Post("deactivate")
  public async deactivate(@Body() data: { id: string }): Promise<any> {
    const existingChatAutomation =
      await this.telegramChatAutomationsDaoService.get(data.id);

    if (_.isNil(existingChatAutomation)) {
      return Promise.reject("A chat automation with this ID was not found.");
    }

    return this.telegramChatAutomationsHandlerService.deactivate(data.id);
  }
}
