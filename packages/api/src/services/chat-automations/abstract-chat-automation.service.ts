import { Injectable } from "@nestjs/common";

import { ChatAutomation } from "@/shared-core";

@Injectable()
export abstract class AbstractChatAutomationService {
  public abstract create(): Promise<{ id: string }>;

  public abstract getAll(): Promise<ChatAutomation[]>;

  public abstract get(id: string): Promise<ChatAutomation | null>;

  public abstract update(
    id: string,
    chatAutomation: Partial<ChatAutomation>
  ): Promise<any>;

  public abstract delete(id: string): Promise<any>;

  public abstract activate(chatAutomation: ChatAutomation): Promise<any>;

  public abstract deactivate(id: string): Promise<any>;
}
