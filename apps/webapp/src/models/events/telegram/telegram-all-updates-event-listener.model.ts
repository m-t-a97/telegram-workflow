import { Api, TelegramClient } from "telegram";
import { Raw } from "telegram/events";
import { RawInterface } from "telegram/events/Raw";

import AbstractTelegramEventListener from "./abstract-telegram-event-listener.model";

export default class TelegramAllUpdatesEventListener extends AbstractTelegramEventListener {
  constructor(
    protected readonly client: TelegramClient,
    private readonly params: RawInterface = {}
  ) {
    super(client, new Raw(params));
  }

  public addListener(callback: (update: Api.TypeUpdate) => any): void {
    this.client.addEventHandler(callback, this.event);
  }

  public removeListener(callback: (update: Api.TypeUpdate) => any): void {
    this.client.removeEventHandler(callback, this.event);
  }
}
