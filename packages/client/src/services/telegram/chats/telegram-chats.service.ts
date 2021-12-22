import { Api } from "telegram";

import { HttpConstants } from "@shared-core";

import store, { StoreStateType } from "@/store";
import { ITelegramChatsService } from "./i-telegram-chats.service";
import { IHttpService } from "@/services/http/i-http.service";
import { APIEndpoints } from "@/constants/api-endpoints";

export class TelegramChatsService implements ITelegramChatsService {
  constructor(private readonly httpService: IHttpService) {}

  public async getAll(): Promise<Api.TypeChat[]> {
    return this.httpService.get(APIEndpoints.CHATS, {
      headers: {
        [HttpConstants.API_KEY_HEADER]: (store.state as StoreStateType)
          .authStore.apiKey,
      },
    });
  }
}
