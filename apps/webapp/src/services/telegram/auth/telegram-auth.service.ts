import _ from "lodash";

import {
  HttpConstants,
  LoggerUtils,
  SentCodeResultType,
  SignInResultType,
} from "@/shared-core";

import store, { StoreStateType } from "@/store";
import { ITelegramAuthService } from "./i-telegram-auth.service";
import { IHttpService } from "@/services/http/i-http.service";
import { APIEndpoints } from "@/constants/api-endpoints";

export class TelegramAuthService implements ITelegramAuthService {
  constructor(private readonly httpService: IHttpService) {}

  public async isAuthorised(): Promise<boolean> {
    return this.httpService.get(APIEndpoints.TELEGRAM_AUTH_IS_AUTHORISED, {
      headers: {
        [HttpConstants.API_KEY_HEADER]: (store.state as StoreStateType)
          .authStore.apiKey,
      },
    });
  }

  public async sendCode(phoneNumber: string): Promise<SentCodeResultType> {
    try {
      const data: { phoneCodeHash: string } = await this.httpService.post(
        APIEndpoints.TELEGRAM_AUTH_SEND_CODE,
        {
          phoneNumber,
        },
        {
          headers: {
            [HttpConstants.API_KEY_HEADER]: (store.state as StoreStateType)
              .authStore.apiKey,
          },
        }
      );

      return Promise.resolve({ phoneCodeHash: data.phoneCodeHash });
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
      const { isPasswordRequired } = await this.httpService.post(
        APIEndpoints.TELEGRAM_AUTH_SIGN_IN,
        {
          phoneNumber,
          phoneCodeHash,
          phoneCode,
        },
        {
          headers: {
            [HttpConstants.API_KEY_HEADER]: (store.state as StoreStateType)
              .authStore.apiKey,
          },
        }
      );

      return Promise.resolve({ isPasswordRequired });
    } catch (error) {
      LoggerUtils.error("TelegramAuthService", "signIn", error);

      return Promise.reject(error);
    }
  }

  public async signInWithTwoFactorPassword(password: string): Promise<any> {
    try {
      await this.httpService.post(
        APIEndpoints.TELEGRAM_AUTH_SIGN_IN_WITH_TWO_FACTOR,
        {
          password,
        },
        {
          headers: {
            [HttpConstants.API_KEY_HEADER]: (store.state as StoreStateType)
              .authStore.apiKey,
          },
        }
      );

      return Promise.resolve();
    } catch (error) {
      LoggerUtils.error(
        "TelegramAuthService",
        "signInWithTwoFactorPassword",
        error
      );

      return Promise.reject(error);
    }
  }
}
