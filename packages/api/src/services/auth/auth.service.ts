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

  public async isApiKeyVerified(apiKey: string): Promise<boolean> {
    try {
      const hashedApiKey: string = createHmac(
        "sha256",
        this.configService.get<string>("API_KEY")
      ).digest("hex");

      return Promise.resolve(_.isEqual(apiKey, hashedApiKey));
    } catch (error) {
      Logger.error(error.message, "AuthService:isApiKeyVerified");
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
