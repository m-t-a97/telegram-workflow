import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { isEqual } from "lodash";
import { Request, Response, NextFunction } from "express";

import { HttpConstants } from "@/shared-core";

import { EnvironmentVariables } from "src/constants/environment-variables";

@Injectable()
export class ApiKeyVerificationMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>
  ) {}

  use(request: Request, response: Response, next: NextFunction) {
    if (
      isEqual(
        request.headers[HttpConstants.API_KEY_HEADER],
        this.configService.get<string>("API_KEY")
      )
    ) {
      next();
    } else {
      return response.status(403).json({
        message:
          "You are unauthorised to access this resource. You must provide a valid API_KEY.",
      });
    }
  }
}
