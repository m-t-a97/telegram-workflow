import { ChatAutomation, LoggerUtils } from "@shared-core";

import { APIEndpoints } from "@/constants/api-endpoints";
import { IHttpService } from "@/services/http/i-http.service";
import {
  ChatAutomationCreatedResultType,
  ITelegramChatsAutomationDaoService,
} from "./i-telegram-chats-automation-dao.service";

export class ApiTelegramChatsAutomationDaoService
  implements ITelegramChatsAutomationDaoService
{
  constructor(private readonly httpService: IHttpService) {}

  public async create(): Promise<ChatAutomationCreatedResultType> {
    try {
      const { uid } = await this.httpService.get<{ uid: string }>(
        APIEndpoints.CHAT_AUTOMATIONS_CREATE
      );

      return Promise.resolve({
        uid,
      });
    } catch (error) {
      LoggerUtils.error(
        "ApiTelegramChatsAutomationDaoService",
        "create",
        error
      );

      return Promise.reject(error);
    }
  }

  public async getAll(): Promise<ChatAutomation[]> {
    return this.httpService.get<ChatAutomation[]>(
      APIEndpoints.CHAT_AUTOMATIONS
    );
  }

  public async getOne(id: string): Promise<ChatAutomation> {
    return this.httpService.get(`${APIEndpoints.CHAT_AUTOMATIONS}/${id}`);
  }

  public async update(
    id: string,
    chatAutomation: Partial<ChatAutomation>
  ): Promise<void> {
    return this.httpService.put(
      `${APIEndpoints.CHAT_AUTOMATIONS}/${id}`,
      chatAutomation
    );
  }

  public async delete(id: string): Promise<void> {
    return this.httpService.delete(`${APIEndpoints.CHAT_AUTOMATIONS}/${id}`);
  }
}
