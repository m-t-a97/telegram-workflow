import { Body, Controller, Get, Post } from "@nestjs/common";

import { AbstractAuthService } from "src/services/auth/abstract-auth.service";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AbstractAuthService) {}

  @Post("verify-api-key")
  public async verifyApiKey(
    @Body() data: { apiKey: string }
  ): Promise<boolean> {
    return this.authService.isApiKeyVerified(data.apiKey);
  }

  @Get("fetch-api-credentials")
  public async fetchApiCredentials(): Promise<{
    apiId: string;
    apiHash: string;
  }> {
    return this.authService.fetchApiCredentials();
  }
}
