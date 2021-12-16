export type SentCodeResultType = {
  phoneCodeHash: string;
};

export type SignInResultType = {
  passwordHint?: string;
  isPasswordRequired: boolean;
};

/**
 * An interface for implementing telegram authentication.
 */
export interface ITelegramAuthService {
  /**
   * Sets up and initialises the service.
   * @returns {Promise<void>} promise void
   */
  initialise(): Promise<void>;

  /**
   * Sends an auth code to the user's telegram account.
   * @param {string} phoneNumber
   * @returns {Promise<SentCodeResultType>} the result from sending the auth code.
   */
  sendCode(phoneNumber: string): Promise<SentCodeResultType>;

  /**
   * Signs in the user to their telegram account.
   * @param {string} phoneNumber
   * @param {string} phoneCodeHash
   * @param {string} phoneCode
   * @returns {Promise<SignInResultType>} the result from signing in.
   */
  signIn(
    phoneNumber: string,
    phoneCodeHash: string,
    phoneCode: string
  ): Promise<SignInResultType>;

  /**
   * Signs in the user to their telegram account with their 2FA password.
   * @param {string} password
   * @returns {Promise<any>} the result from signing in with their 2FA password.
   */
  signInWithTwoFactorPassword(password: string): Promise<any>;

  /**
   * Gets the telegram client used in this service.
   * @returns {any} the client instance.
   */
  getClient(): any;

  /**
   * Checks whether the telegram client is connected.
   * @returns {Promise<boolean>} promise boolean.
   */
  isConnected(): Promise<boolean>;

  /**
   * Checks whether the current user is logged in and authorised to use the telegram API.
   * @returns {Promise<boolean>} promise boolean.
   */
  isAuthorised(): Promise<boolean>;

  /**
   * Executes any cleanup operations needed for this service.
   * @returns {Promise<void>} promise void.
   */
  disconnect(): Promise<void>;
}
