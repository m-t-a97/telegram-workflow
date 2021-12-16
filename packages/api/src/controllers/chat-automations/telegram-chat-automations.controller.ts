import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Put,
} from "@nestjs/common";

import _ from "lodash";

import { ChatAutomation } from "@/shared-core";

import { AbstractTelegramChatAutomationsDaoService as AbstractTelegramChatAutomationsDaoService } from "src/services/chat-automations/abstract-telegram-chat-automations-dao.service";

@Controller("api/chat-automations")
export class TelegramChatAutomationsController {
  constructor(
    private readonly telegramChatAutomationsDaoService: AbstractTelegramChatAutomationsDaoService
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
    try {
      const existingChatAutomation =
        await this.telegramChatAutomationsDaoService.get(id);

      if (_.isNil(existingChatAutomation)) {
        return Promise.reject("A chat automation with this ID was not found.");
      }

      return this.telegramChatAutomationsDaoService.update(id, chatAutomation);
    } catch (error) {
      Logger.error(error.message, "TelegramChatAutomationsController:update");
    }
  }

  @Delete(":id")
  public async delete(@Param("id") id: string): Promise<void> {
    try {
      const existingChatAutomation =
        await this.telegramChatAutomationsDaoService.get(id);

      if (_.isNil(existingChatAutomation)) {
        return Promise.reject("A chat automation with this ID was not found.");
      }

      return this.telegramChatAutomationsDaoService.delete(id);
    } catch (error) {
      Logger.error(error.message, "TelegramChatAutomationsController:delete");
    }
  }
}
