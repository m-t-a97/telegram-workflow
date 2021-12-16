import { TelegramClient } from "telegram";
import { EventBuilder } from "telegram/events/common";

export default abstract class AbstractTelegramEventListener {
  constructor(
    protected readonly client: TelegramClient,
    protected readonly event: EventBuilder
  ) {}

  public addListener(callback: (eventType: any) => any): void {
    this.client.addEventHandler(callback, this.event);
  }

  public removeListener(callback: (eventType: any) => any): void {
    this.client.removeEventHandler(callback, this.event);
  }
}
