import _ from "lodash";
import { createHmac } from "crypto";

import { LoggerUtils, HttpConstants } from "@/shared-core";

import { LocalStorageKeys } from "@/constants/local-storage-keys";
import { APIEndpoints } from "@/constants/api-endpoints";
import { LocalStorageService } from "../storage/local-storage.service";
import { IAuthService } from "./i-auth.service";
import { IHttpService } from "../http/i-http.service";

export class AuthService implements IAuthService {
  constructor(private readonly httpService: IHttpService) {}

  public async signIn(apiKey: string): Promise<boolean> {
    try {
      const hashedApiKey: string = createHmac("sha256", apiKey).digest("hex");

      const isApiKeyVerified = await this.httpService.get<boolean>(
        `${APIEndpoints.AUTH_VERIFY_API_KEY}?api_key=${hashedApiKey}`,
        {
          headers: {
            [HttpConstants.API_KEY_HEADER]: hashedApiKey,
          },
        }
      );

      if (isApiKeyVerified) {
        await LocalStorageService.setItem(
          LocalStorageKeys.API_KEY,
          hashedApiKey
        );

        return Promise.resolve(true);
      } else {
        return Promise.reject({ message: "API_KEY is invalid" });
      }
    } catch (error) {
      LoggerUtils.error("AuthService", "signIn", error);

      return Promise.reject(error);
    }
  }
}
