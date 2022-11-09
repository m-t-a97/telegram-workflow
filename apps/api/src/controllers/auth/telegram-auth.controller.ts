import { Body, Controller, Get, Logger, Post } from "@nestjs/common";

import { SentCodeResultType, SignInResultType } from "@/shared-core";

import { AbstractTelegramAuthService } from "src/services/auth/abstract-telegram-auth.service";

@Controller("telegram-auth")
export class TelegramAuthController {
  constructor(
    private readonly telegramAuthService: AbstractTelegramAuthService
  ) {}

  @Get("is-authorised")
  public async isAuthorised(): Promise<boolean> {
    try {
      const isClientConnected = await this.telegramAuthService.isConnected();
      const isAuthorised = await this.telegramAuthService.isAuthorised();

      return isClientConnected && isAuthorised;
    } catch (error) {
      Logger.error(error.message, "TelegramAuthController:isAuthorised");
    }

    return false;
  }

  @Post("send-code")
  public async sendCode(
    @Body() data: { phoneNumber: string }
  ): Promise<SentCodeResultType> {
    return this.telegramAuthService.sendCode(data.phoneNumber);
  }

  @Post("sign-in")
  public async signIn(
    @Body()
    data: {
      phoneNumber: string;
      phoneCodeHash: string;
      phoneCode: string;
    }
  ): Promise<SignInResultType> {
    return this.telegramAuthService.signIn(
      data.phoneNumber,
      data.phoneCodeHash,
      data.phoneCode
    );
  }

  @Post("sign-in-with-two-factor")
  public async signInWithTwoFactorPassword(
    @Body() data: { password: string }
  ): Promise<any> {
    return this.telegramAuthService.signInWithTwoFactorPassword(data.password);
  }
}
