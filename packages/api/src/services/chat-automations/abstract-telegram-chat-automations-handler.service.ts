import { ChatAutomation } from "@/shared-core";

export abstract class AbstractTelegramChatAutomationsHandlerService {
  public abstract activate(chatAutomation: ChatAutomation): Promise<any>;

  public abstract deactivate(id: string): Promise<any>;

  public abstract subscribeToNewMessageEventHandler(): void;

  public abstract unsubscribeFromNewMessageEventHandler(): void;

  public abstract executeChatAutomation(
    chatAutomation: ChatAutomation
  ): Promise<void>;
}
