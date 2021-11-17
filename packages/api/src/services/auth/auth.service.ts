import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import _ from "lodash";

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
    return Promise.resolve(
      _.isEqual(authKey, this.configService.get<string>("AUTH_KEY"))
    );
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
