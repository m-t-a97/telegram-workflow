import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { isEqual } from "lodash";

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
      return Promise.resolve(
        isEqual(apiKey, this.configService.get<EnvironmentVariables>("API_KEY"))
      );
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
