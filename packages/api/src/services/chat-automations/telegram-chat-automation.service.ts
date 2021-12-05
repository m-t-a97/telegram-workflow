import { Injectable } from "@nestjs/common";

import _ from "lodash";

import { ChatAutomation, IDUtils, LoggerUtils } from "@autogram/shared-core";

import { AbstractChatAutomationService } from "./abstract-chat-automation.service";

@Injectable()
export class TelegramChatAutomationService extends AbstractChatAutomationService {
  private chatAutomations: ChatAutomation[] = [];

  public async create(): Promise<{ uid: string }> {
    const newAutomation: ChatAutomation = {
      id: IDUtils.generate(),
      name: `automation-${IDUtils.generate(6, false)}`.toUpperCase(),
      sourceChatId: null,
      destinationChatIds: [],
      active: false,
      touched: false,
    };

    this.chatAutomations.push(newAutomation);

    return Promise.resolve({ uid: newAutomation.id });
  }

  public async getAll(): Promise<ChatAutomation[]> {
    return Promise.resolve(this.chatAutomations);
  }

  public async get(id: string): Promise<ChatAutomation | null> {
    const chatAutomation = this.chatAutomations.find(
      (chatAutomation: ChatAutomation) => _.isEqual(chatAutomation.id, id)
    );

    return Promise.resolve(chatAutomation);
  }

  public async update(
    id: string,
    chatAutomation: Partial<ChatAutomation>
  ): Promise<any> {
    let automationToUpdateIndex = this.chatAutomations.findIndex(
      (chatAutomation: ChatAutomation) => _.isEqual(chatAutomation.id, id)
    );

    if (!_.isEqual(automationToUpdateIndex, -1)) {
      this.chatAutomations[automationToUpdateIndex] = {
        ...this.chatAutomations[automationToUpdateIndex],
        ...chatAutomation,
      };
    }

    return Promise.resolve();
  }

  public async delete(id: string): Promise<void> {
    this.chatAutomations = this.chatAutomations.filter(
      (chatAutomation: ChatAutomation) => !_.isEqual(chatAutomation.id, id)
    );

    return Promise.resolve();
  }

  public async activate(chatAutomation: ChatAutomation): Promise<any> {
    try {
      console.log(chatAutomation);

      // if (_.isNil(this.chatAutomationsUserMap[userId])) {
      //   this.chatAutomationsUserMap[userId] = {
      //     telegramSessionKey: data.telegramSessionKey,
      //     automations: {
      //       [data.chatAutomation.id]: data.chatAutomation,
      //     },
      //   };
      // } else {
      //   this.chatAutomationsUserMap[userId].automations[
      //     data.chatAutomation.id
      //   ] = data.chatAutomation;
      // }

      // LoggerUtils.log(
      //   "TelegramChatAutomationService",
      //   "activate",
      //   this.chatAutomationsUserMap[userId]
      // );

      // await this.queue.add(constants.queue.chatAutomationJobKey, {
      //   uid: userId,
      //   chatAutomation: data.chatAutomation,
      // });

      return {
        message: `Added new chat automation`,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async deactivate(id: string): Promise<any> {
    // delete this.chatAutomationsUserMap[userId]?.automations[
    //   data.chatAutomation.id
    // ];
    // LoggerUtils.log(
    //   "TelegramChatAutomationService",
    //   "deactivate",
    //   this.chatAutomationsUserMap[userId]
    // );
  }

  private async executeChatAutomations(): Promise<void> {
    try {
      // ------------------------------------------------------------------------
      // And also listen for new telegram messages
      // ------------------------------------------------------------------------
      // this.client.addEventHandler(callback, new NewMessage({}));
    } catch (error) {
      LoggerUtils.error(
        "TelegramChatAutomationService",
        "executeChatAutomations",
        error
      );
    }
  }
}
