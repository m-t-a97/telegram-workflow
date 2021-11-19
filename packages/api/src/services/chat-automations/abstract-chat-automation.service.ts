import { Injectable } from "@nestjs/common";

import { ChatAutomation } from "@autogram/shared-core";

@Injectable()
export abstract class AbstractChatAutomationService {
  public abstract create(): Promise<{ uid: string }>;

  public abstract getAll(): Promise<ChatAutomation[]>;

  public abstract get(id: string): Promise<ChatAutomation | null>;

  public abstract update(
    id: string,
    chatAutomation: Partial<ChatAutomation>
  ): Promise<any>;

  public abstract delete(id: string): Promise<any>;

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
