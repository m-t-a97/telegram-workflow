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

  public async signIn(authKey: string): Promise<boolean> {
    try {
      const hashedAuthKey: string = createHmac("sha256", authKey).digest("hex");

      const isAuthKeyVerified = await this.httpService.post<{
        authKey: string;
      }>(APIEndpoints.AUTH_VERIFY_AUTH_KEY, {
        authKey: hashedAuthKey,
      });

      if (isAuthKeyVerified) {
        await LocalStorageService.setItem(
          LocalStorageKeys.AUTH_KEY,
          hashedAuthKey
        );

        return Promise.resolve(true);
      } else {
        return Promise.reject({ message: "Auth key is invalid" });
      }
    } catch (error) {
      LoggerUtils.error("AuthService", "signIn", error);

      return Promise.reject(error);
    }
  }
}
