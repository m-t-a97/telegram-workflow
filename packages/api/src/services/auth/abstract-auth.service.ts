import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class AbstractAuthService {
  public abstract isApiKeyVerified(apiKey: string): Promise<boolean>;
  public abstract fetchApiCredentials(): Promise<{
    apiId: string;
    apiHash: string;
  }>;
}
