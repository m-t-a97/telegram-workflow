import { ChatAutomation, HttpConstants, LoggerUtils } from "@/shared-core";

import store, { StoreStateType } from "@/store/index";
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
        APIEndpoints.CHAT_AUTOMATIONS_CREATE,
        {
          headers: {
            [HttpConstants.API_KEY_HEADER]: (store.state as StoreStateType)
              .authStore.apiKey,
          },
        }
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
      APIEndpoints.CHAT_AUTOMATIONS,
      {
        headers: {
          [HttpConstants.API_KEY_HEADER]: (store.state as StoreStateType)
            .authStore.apiKey,
        },
      }
    );

    await store.dispatch(
      TelegramStoreActions.UPDATE_TELEGRAM_CHAT_AUTOMATIONS,
      chatAutomations
    );

    return chatAutomations;
  }

  public async getOne(id: string): Promise<ChatAutomation> {
    return this.httpService.get(`${APIEndpoints.CHAT_AUTOMATIONS}/${id}`, {
      headers: {
        [HttpConstants.API_KEY_HEADER]: (store.state as StoreStateType)
          .authStore.apiKey,
      },
    });
  }

  public async update(
    id: string,
    chatAutomation: Partial<ChatAutomation>
  ): Promise<void> {
    return this.httpService.put(
      `${APIEndpoints.CHAT_AUTOMATIONS}/${id}`,
      chatAutomation,
      {
        headers: {
          [HttpConstants.API_KEY_HEADER]: (store.state as StoreStateType)
            .authStore.apiKey,
        },
      }
    );
  }

  public async delete(id: string): Promise<void> {
    return this.httpService.delete(`${APIEndpoints.CHAT_AUTOMATIONS}/${id}`, {
      headers: {
        [HttpConstants.API_KEY_HEADER]: (store.state as StoreStateType)
          .authStore.apiKey,
      },
    });
  }
}
