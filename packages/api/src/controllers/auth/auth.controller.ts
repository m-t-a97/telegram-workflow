import { Body, Controller, Get, Post } from "@nestjs/common";

import { AbstractAuthService } from "src/services/auth/abstract-auth.service";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AbstractAuthService) {}

  @Post("/verify-auth-key")
  public async verifyAuthKey(
    @Body() data: { authKey: string }
  ): Promise<boolean> {
    return this.authService.isAuthKeyVerified(data.authKey);
  }

  @Get("/fetch-api-credentials")
  public async fetchApiCredentials(): Promise<{
    apiId: string;
    apiHash: string;
  }> {
    return this.authService.fetchApiCredentials();
  }
}
