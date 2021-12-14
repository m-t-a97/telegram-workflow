import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import _ from "lodash";
import { createHmac } from "crypto";

import { EnvironmentVariables } from "src/constants/environment-variables";
import { AbstractAuthService } from "./abstract-auth.service";

@Injectable()
export class AuthService extends AbstractAuthService {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>
  ) {
    super();
  }

  public async isAuthKeyVerified(authKey: string): Promise<boolean> {
    try {
      const hashedAuthKey: string = createHmac(
        "sha256",
        this.configService.get<string>("AUTH_KEY")
      ).digest("hex");

      return Promise.resolve(_.isEqual(authKey, hashedAuthKey));
    } catch (error) {
      Logger.error(error.message, "AuthService:isAuthKeyVerified");
    }
  }

  public async fetchApiCredentials(): Promise<{
    apiId: string;
    apiHash: string;
  }> {
    return Promise.resolve({
      apiId: this.configService.get<string>("API_ID"),
      apiHash: this.configService.get<string>("API_HASH"),
    });
  }
}
