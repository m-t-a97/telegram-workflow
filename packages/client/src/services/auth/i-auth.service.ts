export interface IAuthService {
  signIn(apiKey: string): Promise<any>;
}
