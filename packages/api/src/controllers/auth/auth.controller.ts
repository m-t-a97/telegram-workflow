import { Body, Controller, Get, Post } from "@nestjs/common";

import { AbstractAuthService } from "src/services/auth/abstract-auth.service";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AbstractAuthService) {}

  @Post("/verify_auth_key")
  public async verifyAuthKey(
    @Body() data: { authKey: string }
  ): Promise<boolean> {
    return this.authService.isAuthKeyVerified(data.authKey);
  }

  @Get("/fetch_api_credentials")
  public async fetchApiCredentials(): Promise<{
    apiId: string;
    apiHash: string;
  }> {
    return this.authService.fetchApiCredentials();
  }
}
