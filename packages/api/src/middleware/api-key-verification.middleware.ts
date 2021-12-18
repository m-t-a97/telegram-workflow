import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import _ from "lodash";
import { Request, Response, NextFunction } from "express";
import { createHmac } from "crypto";

import { HttpConstants } from "@/shared-core";

import { EnvironmentVariables } from "src/constants/environment-variables";

@Injectable()
export class ApiKeyVerificationMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>
  ) {}

  use(request: Request, response: Response, next: NextFunction) {
    const hashedApiKey: string = createHmac(
      "sha256",
      this.configService.get<string>("API_KEY")
    ).digest("hex");

    if (
      _.isEqual(hashedApiKey, request.headers[HttpConstants.API_KEY_HEADER])
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
