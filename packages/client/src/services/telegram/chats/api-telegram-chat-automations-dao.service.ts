import { ChatAutomation, LoggerUtils } from "@shared-core";

import store from "@/store";
import { APIEndpoints } from "@/constants/api-endpoints";
import { IHttpService } from "@/services/http/i-http.service";
import {
  ChatAutomationCreatedResultType,
  ITelegramChatAutomationsDaoService,
} from "./i-telegram-chat-automations-dao.service";
import { TelegramStoreActions } from "@/store/modules/telegram.store";

export class ApiTelegramChatAutomationsDaoService
  implements ITelegramChatAutomationsDaoService
{
  constructor(private readonly httpService: IHttpService) {}

  public async create(): Promise<ChatAutomationCreatedResultType> {
    try {
      const { id } = await this.httpService.get<{ id: string }>(
        APIEndpoints.CHAT_AUTOMATIONS_CREATE
      );

      await this.getAll();

      return Promise.resolve({
        id,
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
    const chatAutomations = await this.httpService.get<ChatAutomation[]>(
      APIEndpoints.CHAT_AUTOMATIONS
    );

    await store.dispatch(
      TelegramStoreActions.UPDATE_TELEGRAM_CHAT_AUTOMATIONS,
      chatAutomations
    );

    return chatAutomations;
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
