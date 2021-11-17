import { Injectable } from "@nestjs/common";

import { ChatAutomation } from "@autogram/shared-core";

@Injectable()
export abstract class AbstractChatAutomationService {
  public abstract activate(data: {
    idToken: string;
    telegramSessionKey: string;
    chatAutomation: ChatAutomation;
  }): Promise<any>;

  public abstract deactivate(data: {
    idToken: string;
    chatAutomation: ChatAutomation;
  }): Promise<any>;
}
