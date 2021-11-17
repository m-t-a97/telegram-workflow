import { Controller, Get } from "@nestjs/common";

import { AppService } from "../services/app.service";

@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  public welcome(): Record<string, any> {
    return this.appService.welcome();
  }
}
