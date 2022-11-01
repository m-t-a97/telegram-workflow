import { Injectable } from "@nestjs/common";

import { TelegramClient } from "telegram";

@Injectable()
export abstract class AbstractTelegramChatAutomationsHandlerService {
  public abstract subscribeToNewMessageEventHandler(
    client: TelegramClient
  ): void;

  public abstract unsubscribeFromNewMessageEventHandler(
    client: TelegramClient
  ): void;
}
