import { Body, Controller, Get, Post, Query } from "@nestjs/common";

import { AbstractAuthService } from "src/services/auth/abstract-auth.service";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AbstractAuthService) {}

  @Get("verify-api-key")
  public async verifyApiKey(
    @Query("api_key") api_key: string
  ): Promise<boolean> {
    return this.authService.isApiKeyVerified(api_key);
  }

  @Get("fetch-api-credentials")
  public async fetchApiCredentials(): Promise<{
    apiId: string;
    apiHash: string;
  }> {
    return this.authService.fetchApiCredentials();
  }
}
