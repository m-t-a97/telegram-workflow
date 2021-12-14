import { Module } from "@nestjs/common";

import { AuthController } from "src/controllers/auth/auth.controller";
import { TelegramAuthController } from "src/controllers/auth/telegram-auth.controller";
import { AbstractAuthService } from "src/services/auth/abstract-auth.service";
import { AbstractTelegramAuthService } from "src/services/auth/abstract-telegram-auth.service";
import { AuthService } from "src/services/auth/auth.service";
import { TelegramAuthService } from "src/services/auth/telegram-auth.service";
import { ChatAutomationsModule } from "./chat-automation.module";

@Module({
  imports: [ChatAutomationsModule],
  exports: [AbstractAuthService, AbstractTelegramAuthService],
  controllers: [AuthController, TelegramAuthController],
  providers: [
    {
      provide: AbstractAuthService,
      useClass: AuthService,
    },
    {
      provide: AbstractTelegramAuthService,
      useClass: TelegramAuthService,
    },
  ],
})
export class AuthModule {}
