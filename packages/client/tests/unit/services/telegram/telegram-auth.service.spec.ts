import { RegexUtils } from "@shared-core";

import ITelegramAuthService, {
  SentCodeResultType,
  SignInResultType,
} from "@/services/telegram/auth/i-telegram-auth.service";
import TelegramAuthService from "@/services/telegram/auth/telegram-auth.service";

// Creating Mocks

const mockRegexUtils = RegexUtils;

jest.mock("@/services/telegram/auth/telegram-auth.service", () => {
  return jest.fn().mockImplementation(() => {
    function MockTelgramClient() {
      this.connected = false;
      this.authorised = false;

      this.connect = () => {
        this.connected = true;
      };

      this.checkAuthorisation = (value: boolean) => {
        this.authorised = value;
      };

      this.isConnected = () => {
        return this.connected;
      };

      this.isAuthorised = () => {
        return this.authorised;
      };
    }

    const client = new MockTelgramClient();

    return {
      initialise: jest.fn(() => {
        client.connect();

        return Promise.resolve();
      }),
      sendCode: jest.fn((phoneNumber: string): Promise<SentCodeResultType> => {
        return Promise.resolve({ phoneCodeHash: "YSR7NqJln8cX4ul4CL4ae" });
      }),
      signIn: jest.fn(
        (
          phoneNumber: string,
          phoneCodeHash: string,
          phoneCode: string
        ): Promise<SignInResultType> => {
          if (phoneCode.length === 5) {
            if (mockRegexUtils.isDigitsOnly(phoneCode)) {
              // Simulating an account that doesn't have a 2FA password
              if (phoneNumber === "+44XXXXXXXXXX") {
                client.checkAuthorisation(true);

                return Promise.resolve({ isPasswordRequired: false });
              }
              // Else simulating any other account would have a 2FA password
              else {
                client.checkAuthorisation(false);

                return Promise.resolve({ isPasswordRequired: true });
              }
            } else {
              return Promise.reject({ message: "Code must be digits only." });
            }
          } else {
            return Promise.reject({ message: "Code must be 5 digits." });
          }
        }
      ),
      signInWithTwoFactorPassword: jest.fn((password: string): Promise<any> => {
        client.checkAuthorisation(true);

        return Promise.resolve();
      }),
      getClient: jest.fn(() => {
        return client;
      }),
      isConnected: jest.fn(() => {
        return Promise.resolve(client.isConnected());
      }),
      isAuthorised: jest.fn(() => {
        return Promise.resolve(client.isAuthorised());
      }),
      disconnect: jest.fn(() => {
        return Promise.resolve();
      }),
    };
  });
});

// Tests

describe("Telegram Service", () => {
  let telegramAuthService: ITelegramAuthService;

  const phoneNumber = "+441234567890";
  const phoneCode = "12345";
  const expectedPhoneCodeHash = "YSR7NqJln8cX4ul4CL4ae";

  beforeEach(() => {
    (TelegramAuthService as any).mockClear();
    telegramAuthService = new TelegramAuthService();
  });

  afterEach(async () => {
    await telegramAuthService.disconnect();

    expect(telegramAuthService.disconnect).toHaveBeenCalledTimes(1);
  });

  describe("Service", () => {
    it("should test that the Service is created", () => {
      expect(telegramAuthService).toBeTruthy();
    });

    it("should test that the Service is initialised", async () => {
      await telegramAuthService.initialise();

      expect(telegramAuthService.initialise).toHaveBeenCalledTimes(1);
    });
  });

  describe("Telegram Client", () => {
    it("should test that the telegram client is created", async () => {
      await telegramAuthService.initialise();

      expect(telegramAuthService.initialise).toHaveBeenCalledTimes(1);
      expect(telegramAuthService.getClient()).toBeTruthy();
      expect(await telegramAuthService.isConnected()).toBe(true);
    });
  });

  describe("Sending Code", () => {
    it("should test that we get back a phoneCodeHash when sending a code to the telegram user", async () => {
      const { phoneCodeHash } = await telegramAuthService.sendCode(phoneNumber);

      expect(telegramAuthService.sendCode).toHaveBeenCalledTimes(1);
      expect(phoneCodeHash).toEqual(expectedPhoneCodeHash);
    });
  });

  describe("Sign in", () => {
    it("should test that an error message is displayed when the auth code is not 5 digits in length", async () => {
      try {
        const { phoneCodeHash } = await telegramAuthService.sendCode(
          phoneNumber
        );
        await telegramAuthService.signIn("+44XXXXXXXXXX", phoneCodeHash, "123");
      } catch (error) {
        expect(error.message).toEqual("Code must be 5 digits.");
      }
    });

    it("should test that an error message is displayed when the auth code is not digits only", async () => {
      try {
        const { phoneCodeHash } = await telegramAuthService.sendCode(
          phoneNumber
        );
        await telegramAuthService.signIn(
          "+44XXXXXXXXXX",
          phoneCodeHash,
          "123ab"
        );
      } catch (error) {
        expect(error.message).toEqual("Code must be digits only.");
      }
    });

    it("should test that the user can sign into their telegram account without a password if they don't have 2FA", async () => {
      const { phoneCodeHash } = await telegramAuthService.sendCode(phoneNumber);
      const { isPasswordRequired } = await telegramAuthService.signIn(
        "+44XXXXXXXXXX",
        phoneCodeHash,
        phoneCode
      );

      expect(telegramAuthService.sendCode).toHaveBeenCalledTimes(1);
      expect(telegramAuthService.signIn).toHaveBeenCalledTimes(1);
      expect(isPasswordRequired).toBe(false);
      expect(await telegramAuthService.isAuthorised()).toBe(true);
    });

    it("should test that the user requires a Two Factor password to sign into telegram with their credentials", async () => {
      await telegramAuthService.initialise();

      const { phoneCodeHash } = await telegramAuthService.sendCode(phoneNumber);
      const { isPasswordRequired } = await telegramAuthService.signIn(
        phoneNumber,
        phoneCodeHash,
        phoneCode
      );

      expect(isPasswordRequired).toBe(true);
      expect(await telegramAuthService.isAuthorised()).toBe(false);
    });

    it("should test signing into telegram via Two Factor password when it is required after attempted sign in", async () => {
      await telegramAuthService.initialise();

      const { phoneCodeHash } = await telegramAuthService.sendCode(phoneNumber);
      const { isPasswordRequired } = await telegramAuthService.signIn(
        phoneNumber,
        phoneCodeHash,
        phoneCode
      );
      await telegramAuthService.signInWithTwoFactorPassword("Password123");

      expect(
        telegramAuthService.signInWithTwoFactorPassword
      ).toHaveBeenCalledTimes(1);
      expect(isPasswordRequired).toBe(true);
      expect(await telegramAuthService.isAuthorised()).toBe(true);
    });
  });
});
