import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  public welcome(): Record<string, any> {
    return { message: "Server is up and running!" };
  }
}
