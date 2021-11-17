import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthController } from "src/controllers/auth/auth.controller";
import { AbstractAuthService } from "src/services/auth/abstract-auth.service";
import { AuthService } from "src/services/auth/auth.service";

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    {
      provide: AbstractAuthService,
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
