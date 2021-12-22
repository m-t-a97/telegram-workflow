import { Injectable } from "@nestjs/common";

import { TelegramClient } from "telegram";

import { SentCodeResultType, SignInResultType } from "@/shared-core";

@Injectable()
export abstract class AbstractTelegramAuthService {
  public abstract sendCode(phoneNumber: string): Promise<SentCodeResultType>;

  public abstract signIn(
    phoneNumber: string,
    phoneCodeHash: string,
    phoneCode: string
  ): Promise<SignInResultType>;

  public abstract signInWithTwoFactorPassword(password: string): Promise<any>;
  public abstract getClient(): TelegramClient;
  public abstract isConnected(): Promise<boolean>;
  public abstract isAuthorised(): Promise<boolean>;
  public abstract disconnect(): Promise<void>;
}
