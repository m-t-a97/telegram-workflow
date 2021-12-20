import { Injectable, Logger } from "@nestjs/common";

import _ from "lodash";

import { ChatAutomation, IDUtils } from "@/shared-core";

import { AbstractTelegramChatAutomationsDaoService } from "./abstract-telegram-chat-automations-dao.service";
import { DbService } from "../db/db.service";

@Injectable()
export class TelegramChatAutomationsDaoService extends AbstractTelegramChatAutomationsDaoService {
  constructor(private readonly dbService: DbService) {
    super();
  }

  public async create(): Promise<{ id: string }> {
    try {
      const newChatAutomation =
        await this.dbService.prismaClient.chatAutomation.create({
          data: {
            name: `automation-${IDUtils.generate(6, false)}`.toUpperCase(),
          },
        });

      return Promise.resolve({ id: newChatAutomation.id });
    } catch (error) {
      Logger.error(error.message, "TelegramChatAutomationsDaoService:create");

      return Promise.reject(error);
    }
  }

  public async getAll(): Promise<ChatAutomation[]> {
    return (await this.dbService.prismaClient.chatAutomation.findMany()).map(
      (chatAutomation) => {
        return {
          ...chatAutomation,
          sourceChatId: chatAutomation.sourceChatId?.toString(),
          destinationChatIds:
            chatAutomation.destinationChatIds.length > 0
              ? chatAutomation.destinationChatIds.map((destinationChatId) =>
                  destinationChatId.toString()
                )
              : [],
        } as ChatAutomation;
      }
    );
  }

  public async get(id: string): Promise<ChatAutomation | null> {
    try {
      const chatAutomation =
        await this.dbService.prismaClient.chatAutomation.findUnique({
          where: {
            id: id,
          },
        });

      return Promise.resolve({
        ...chatAutomation,
        sourceChatId: chatAutomation.sourceChatId?.toString(),
        destinationChatIds:
          chatAutomation.destinationChatIds.length > 0
            ? chatAutomation.destinationChatIds.map((destinationChatId) =>
                destinationChatId.toString()
              )
            : [],
      });
    } catch (error) {
      Logger.error(error.message, "TelegramChatAutomationsDaoService:get");

      return Promise.reject(error);
    }
  }

  public async update(
    id: string,
    chatAutomation: Partial<ChatAutomation>
  ): Promise<any> {
    return this.dbService.prismaClient.chatAutomation.update({
      where: {
        id: id,
      },
      data: {
        ...chatAutomation,
      },
    });
  }

  public async delete(id: string): Promise<any> {
    try {
      await this.dbService.prismaClient.chatAutomation.delete({
        where: {
          id: id,
        },
      });

      return Promise.resolve({
        message: `Successfully deleted the chat automation with id ${id}.`,
      });
    } catch (error) {
      Logger.error(error.message, "TelegramChatAutomationsDaoService:delete");

      return Promise.reject(error);
    }
  }
}
