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

import { AbstractChatAutomationService } from "src/services/chat-automations/abstract-chat-automation.service";

@Controller("api/chat-automations")
export class ChatAutomationsController {
  constructor(
    private readonly chatAutomationService: AbstractChatAutomationService
  ) {}

  @Get("create")
  public async create(): Promise<{ id: string }> {
    return this.chatAutomationService.create();
  }

  @Get()
  public async getAll(): Promise<ChatAutomation[]> {
    return this.chatAutomationService.getAll();
  }

  @Get(":id")
  public async get(@Param("id") id: string): Promise<ChatAutomation | null> {
    return this.chatAutomationService.get(id);
  }

  @Put(":id")
  public async update(
    @Param("id") id: string,
    @Body() chatAutomation: Partial<ChatAutomation>
  ): Promise<void> {
    const existingChatAutomation = await this.chatAutomationService.get(id);

    if (_.isNil(existingChatAutomation)) {
      return Promise.reject("A chat automation with this ID was not found.");
    }

    return this.chatAutomationService.update(id, chatAutomation);
  }

  @Delete(":id")
  public async delete(@Param("id") id: string): Promise<void> {
    const existingChatAutomation = await this.chatAutomationService.get(id);

    if (_.isNil(existingChatAutomation)) {
      return Promise.reject("A chat automation with this ID was not found.");
    }

    return this.chatAutomationService.delete(id);
  }

  @Post("activate")
  public async activate(@Body() chatAutomation: ChatAutomation): Promise<any> {
    return this.chatAutomationService.activate(chatAutomation);
  }

  @Post("deactivate")
  public async deactivate(@Body() data: { id: string }): Promise<any> {
    const existingChatAutomation = await this.chatAutomationService.get(
      data.id
    );

    if (_.isNil(existingChatAutomation)) {
      return Promise.reject("A chat automation with this ID was not found.");
    }

    return this.chatAutomationService.deactivate(data.id);
  }
}
