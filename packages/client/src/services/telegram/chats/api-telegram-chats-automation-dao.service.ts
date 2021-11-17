import { ChatAutomation } from "@shared-core";

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
    return Promise.resolve({
      uid: "",
    });
  }

  public async getAll(): Promise<ChatAutomation[]> {
    return this.httpService.get<ChatAutomation[]>(
      APIEndpoints.CHAT_AUTOMATIONS
    );
  }

  public async getOne(id: string): Promise<ChatAutomation> {
    return Promise.resolve(null);
  }

  public async update(
    id: string,
    data: Partial<ChatAutomation>
  ): Promise<void> {
    return Promise.resolve();
  }

  public async delete(id: string): Promise<void> {
    return Promise.resolve();
  }
}
