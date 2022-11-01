import { Injectable } from "@nestjs/common";

import { PrismaClient } from "@prisma/client";

@Injectable()
export class DbService {
  public readonly prismaClient = new PrismaClient();
}
