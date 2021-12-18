import _ from "lodash";
import { createHmac } from "crypto";

import { LoggerUtils } from "@shared-core";

import { LocalStorageService } from "../storage/local-storage.service";
import { IAuthService } from "./i-auth.service";
import { LocalStorageKeys } from "@/constants/local-storage-keys";
import { IHttpService } from "../http/i-http.service";
import { APIEndpoints } from "@/constants/api-endpoints";

export class AuthService implements IAuthService {
  constructor(private readonly httpService: IHttpService) {}

  public async signIn(apiKey: string): Promise<boolean> {
    try {
      const hashedApiKey: string = createHmac("sha256", apiKey).digest("hex");

      const isApiKeyVerified = await this.httpService.post<{
        apiKey: string;
      }>(APIEndpoints.AUTH_VERIFY_API_KEY, {
        apiKey: hashedApiKey,
      });

      if (isApiKeyVerified) {
        await LocalStorageService.setItem(
          LocalStorageKeys.API_KEY,
          hashedApiKey
        );

        return Promise.resolve(true);
      } else {
        return Promise.reject({ message: "API key is invalid" });
      }
    } catch (error) {
      LoggerUtils.error("AuthService", "signIn", error);

      return Promise.reject(error);
    }
  }
}
