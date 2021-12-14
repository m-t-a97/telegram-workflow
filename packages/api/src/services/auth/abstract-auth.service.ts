import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class AbstractAuthService {
  public abstract isAuthKeyVerified(authKey: string): Promise<boolean>;
  public abstract fetchApiCredentials(): Promise<{
    apiId: string;
    apiHash: string;
  }>;
}
