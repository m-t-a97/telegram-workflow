export interface IAuthService {
  signIn(authKey: string): Promise<any>;
}
