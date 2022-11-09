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
      const isApiKeyVerified = await this.httpService.get<boolean>(
        `${APIEndpoints.AUTH_VERIFY_API_KEY}?api_key=${apiKey}`,
        {
          headers: {
            [HttpConstants.API_KEY_HEADER]: apiKey,
          },
        }
      );

      if (isApiKeyVerified) {
        await LocalStorageService.setItem(LocalStorageKeys.API_KEY, apiKey);

        return Promise.resolve(true);
      } else {
        return Promise.reject(new Error("API_KEY is invalid"));
      }
    } catch (error) {
      LoggerUtils.error("AuthService", "signIn", error);

      return Promise.reject(error);
    }
  }
}
