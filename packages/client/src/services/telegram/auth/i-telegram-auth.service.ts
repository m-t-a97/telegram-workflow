import { SentCodeResultType, SignInResultType } from "@shared-core";

export interface ITelegramAuthService {
  isAuthorised(): Promise<boolean>;

  sendCode(phoneNumber: string): Promise<SentCodeResultType>;

  signIn(
    phoneNumber: string,
    phoneCodeHash: string,
    phoneCode: string
  ): Promise<SignInResultType>;

  signInWithTwoFactorPassword(password: string): Promise<any>;
}
