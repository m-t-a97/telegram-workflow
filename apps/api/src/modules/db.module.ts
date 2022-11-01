import { Module } from "@nestjs/common";

import { DbService } from "src/services/db/db.service";

@Module({
  imports: [],
  exports: [DbService],
  controllers: [],
  providers: [DbService],
})
export class DbModule {}
