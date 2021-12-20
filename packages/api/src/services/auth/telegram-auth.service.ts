import { Injectable } from "@nestjs/common";

import _ from "lodash";
import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

import {
  LoggerUtils,
  RegexUtils,
  SentCodeResultType,
  SignInResultType,
} from "@/shared-core";

import { AbstractTelegramAuthService } from "./abstract-telegram-auth.service";
import { AbstractAuthService } from "./abstract-auth.service";
import { AbstractTelegramChatAutomationsHandlerService } from "../chat-automations/abstract-telegram-chat-automations-handler.service";

@Injectable()
export class TelegramAuthService extends AbstractTelegramAuthService {
  private apiId: number;
  private apiHash: string;
  private stringSession: StringSession;

  private client: TelegramClient;

  constructor(
    private readonly authService: AbstractAuthService,
    private readonly telegramChatAutomationsHandlerService: AbstractTelegramChatAutomationsHandlerService
  ) {
    super();
    this.initialise();
  }

  public async initialise(): Promise<void> {
    try {
      const { apiId, apiHash } = await this.authService.fetchApiCredentials();

      this.apiId = parseInt(apiId);
      this.apiHash = apiHash;

      this.stringSession = new StringSession(
        "1BAAOMTQ5LjE1NC4xNjcuOTEAUJmrzlophtNqKfT8dQ1wkxYJ1ZGpIi6wexxKAeH/hfiQte8YA/1KJTUrUm/qN+DsqCoRL9HpQ0ErOyKz94FPkjkmTo6+zuL5PYznWOtxDhagY760MxCLc+0W9q8tvjuVlGek5hd5IIyvu8s6TF/RTmoO0kKBLcyYxNpl0d5/qIIBC23XkpAC+bElO9Gl7PohqWccGqZ/dnz0XQ2/Zci5g8ToQgkaEktfytEke2PwL4ijt8V4ZKK3ENxd16P8dddbJPM1Y3kCDVuR5KmN7C+QCQxbeLr8UQnl9CFTO+XkBPa3fPt1XjcnGCtKdhATXW5UMQisMSlmYGxzLRHy4Jg+fwk="
      );
      this.stringSession.load();

      this.client = new TelegramClient(
        this.stringSession,
        this.apiId,
        this.apiHash,
        {
          connectionRetries: 3,
        }
      );

      await this.client.connect();

      this.telegramChatAutomationsHandlerService.subscribeToNewMessageEventHandler(
        this.client
      );
    } catch (error) {
      LoggerUtils.error("TelegramAuthService", "initialise", error);
    }
  }

  public async sendCode(phoneNumber: string): Promise<SentCodeResultType> {
    try {
      const { phoneCodeHash }: Api.auth.SentCode = await this.client.invoke(
        new Api.auth.SendCode({
          apiId: this.apiId,
          apiHash: this.apiHash,
          phoneNumber,
          settings: new Api.CodeSettings({
            allowFlashcall: true,
            currentNumber: true,
            allowAppHash: true,
          }),
        })
      );

      return Promise.resolve({ phoneCodeHash });
    } catch (error) {
      LoggerUtils.error("TelegramAuthService", "sendCode", error);

      return Promise.reject(error);
    }
  }

  public async signIn(
    phoneNumber: string,
    phoneCodeHash: string,
    phoneCode: string
  ): Promise<SignInResultType> {
    try {
      if (_.isEqual(phoneCode.length, 5)) {
        if (RegexUtils.isDigitsOnly(phoneCode)) {
          await this.client.invoke(
            new Api.auth.SignIn({ phoneNumber, phoneCodeHash, phoneCode })
          );

          this.stringSession.save();

          return Promise.resolve({ isPasswordRequired: false });
        } else {
          return Promise.reject({ message: "Code must be digits only." });
        }
      } else {
        return Promise.reject({ message: "Code must be 5 digits." });
      }
    } catch (error) {
      if (_.isEqual(error.errorMessage, "SESSION_PASSWORD_NEEDED")) {
        return Promise.resolve({ isPasswordRequired: true });
      } else {
        LoggerUtils.error("TelegramAuthService", "signIn", error);

        throw new Error("AUTH_USER_CANCEL");
      }
    }
  }

  public async signInWithTwoFactorPassword(password: string): Promise<any> {
    try {
      await this.client.signInWithPassword(
        {
          apiId: this.apiId,
          apiHash: this.apiHash,
        },
        {
          password: () => {
            return Promise.resolve(password);
          },
          onError: (error: any) =>
            LoggerUtils.error(
              "TelegramAuthService",
              "signInWithTwoFactorPassword",
              error
            ),
        }
      );

      this.stringSession.save();
    } catch (error) {
      LoggerUtils.error(
        "TelegramAuthService",
        "signInWithTwoFactorPassword",
        error
      );

      return Promise.reject(error);
    }
  }

  public getClient(): TelegramClient {
    return this.client;
  }

  public async isConnected(): Promise<boolean> {
    return Promise.resolve(this.client.connected);
  }

  public async isAuthorised(): Promise<boolean> {
    try {
      const authorised = await this.client.checkAuthorization();

      return Promise.resolve(authorised);
    } catch (error) {
      LoggerUtils.error("TelegramAuthService", "isAuthorised", error);

      return Promise.reject(error);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      this.telegramChatAutomationsHandlerService.unsubscribeFromNewMessageEventHandler(
        this.client
      );
      await this.client.disconnect();
    } catch (error) {
      LoggerUtils.error("TelegramAuthService", "disconnect", error);

      return Promise.reject(error);
    }
  }
}
