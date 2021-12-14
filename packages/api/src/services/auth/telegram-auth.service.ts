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

      // TODO: using for testing purposes so we don't need to keep authenticating on the server side whenever code is updated.
      const stringSessonTest =
        "1BAAOMTQ5LjE1NC4xNjcuOTEAUEw+mBMihd5Yy4lWrZ4iaDIED5dDl8NyDxSKPX5kQMngK0Z8rMzDbWBWbmofJHOo/qdf3nLAKIbsn74AUZHUq8atkeaG/F4F7oY4QNcZ8OANZlf2lFxy0xx0DR1oig+op+wPFTJnvOkRY64/w9s61dQ3kOm8rFOXKKfoSk02eRFq2gZ9eXG3mVOK6zMWVc1NssxtYo3ZwKzvvxoKkGwB/MgGaYBBaWeqTommdHUGTqA32PPhUz7ynWe+CA7cGBYY/jcbCzUrr8yILdVO1OSCVG64+Ey5hSeN80akkb6EUISYRFA0JaLiRiHoeB1GK5LRYzh7/qG5jyJ+x2TWMxNvVXY=";
      this.stringSession = new StringSession(stringSessonTest);
      await this.stringSession.load();

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

          this.telegramChatAutomationsHandlerService.subscribeToNewMessageEventHandler(
            this.client
          );

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

      console.log(this.stringSession.save());

      this.telegramChatAutomationsHandlerService.subscribeToNewMessageEventHandler(
        this.client
      );
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
