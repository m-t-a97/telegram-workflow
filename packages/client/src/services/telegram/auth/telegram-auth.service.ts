import _ from "lodash";
import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

import { LoggerUtils, RegexUtils } from "@shared-core";

import { LocalStorageKeys } from "@/constants/local-storage-keys";
import { LocalStorageService } from "../../storage/local-storage.service";
import {
  ITelegramAuthService,
  SentCodeResultType,
  SignInResultType,
} from "./i-telegram-auth.service";
import { IHttpService } from "@/services/http/i-http.service";
import { APIEndpoints } from "@/constants/api-endpoints";

export class TelegramAuthService implements ITelegramAuthService {
  private apiId: number;
  private apiHash: string;
  private stringSession: StringSession;

  private client: TelegramClient;

  constructor(private readonly httpService: IHttpService) {}

  public async initialise(): Promise<void> {
    try {
      const { apiId, apiHash } = await this.httpService.get(
        APIEndpoints.FETCH_API_CREDENTIALS
      );

      this.apiId = parseInt(apiId);
      this.apiHash = apiHash;

      const savedSessionString: string = await this.loadSessionString();
      this.stringSession = new StringSession(savedSessionString);
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
    } catch (error) {
      LoggerUtils.error("TelegramAuthService", "initialise", error);
    }
  }

  private async loadSessionString(): Promise<string> {
    try {
      const savedTelegramSession: string =
        await LocalStorageService.getItem<string>(
          LocalStorageKeys.SAVED_TELEGRAM_SESSION
        );

      return !_.isNil(savedTelegramSession)
        ? Promise.resolve(savedTelegramSession)
        : Promise.resolve("");
    } catch (error) {
      LoggerUtils.error("TelegramAuthService", "loadSessionString", error);
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

          await LocalStorageService.setItem(
            LocalStorageKeys.SAVED_TELEGRAM_SESSION,
            this.stringSession.save()
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

      await LocalStorageService.setItem(
        LocalStorageKeys.SAVED_TELEGRAM_SESSION,
        this.stringSession.save()
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
      await LocalStorageService.removeItem(
        LocalStorageKeys.SAVED_TELEGRAM_SESSION
      );
      await this.client.disconnect();
    } catch (error) {
      LoggerUtils.error("TelegramAuthService", "disconnect", error);

      return Promise.reject(error);
    }
  }
}
