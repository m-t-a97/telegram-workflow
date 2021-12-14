import { Injectable } from "@nestjs/common";

import _ from "lodash";

import { ChatAutomation, IDUtils } from "@/shared-core";

import { AbstractTelegramChatAutomationsDaoService } from "./abstract-telegram-chat-automations-dao.service";

@Injectable()
export class TelegramChatAutomationsDaoService extends AbstractTelegramChatAutomationsDaoService {
  private _chatAutomations: ChatAutomation[] = [];

  public async create(): Promise<{ id: string }> {
    const newAutomation: ChatAutomation = {
      id: IDUtils.generate(),
      name: `automation-${IDUtils.generate(6, false)}`.toUpperCase(),
      sourceChatId: null,
      destinationChatIds: [],
      active: false,
      touched: false,
    };

    this._chatAutomations.push(newAutomation);

    return Promise.resolve({ id: newAutomation.id });
  }

  public async getAll(): Promise<ChatAutomation[]> {
    return Promise.resolve(this._chatAutomations);
  }

  public async get(id: string): Promise<ChatAutomation | null> {
    const chatAutomation = this._chatAutomations.find(
      (chatAutomation: ChatAutomation) => _.isEqual(chatAutomation.id, id)
    );

    return Promise.resolve(chatAutomation);
  }

  public async update(
    id: string,
    chatAutomation: Partial<ChatAutomation>
  ): Promise<any> {
    let automationToUpdateIndex = this._chatAutomations.findIndex(
      (chatAutomation: ChatAutomation) => _.isEqual(chatAutomation.id, id)
    );

    if (!_.isEqual(automationToUpdateIndex, -1)) {
      this._chatAutomations[automationToUpdateIndex] = {
        ...this._chatAutomations[automationToUpdateIndex],
        ...chatAutomation,
      };
    }

    return Promise.resolve();
  }

  public async delete(id: string): Promise<void> {
    this._chatAutomations = this._chatAutomations.filter(
      (chatAutomation: ChatAutomation) => !_.isEqual(chatAutomation.id, id)
    );

    return Promise.resolve();
  }

  public get chatAutomations(): ChatAutomation[] {
    return this._chatAutomations;
  }
}
