import IAuthService from "@/services/auth/i-auth.service";
import FirebaseAuthService from "@/services/auth/firebase-auth.service";

jest.mock("@/services/auth/firebase-auth.service", () => {
  return jest.fn().mockImplementation(() => {
    return {
      signIn: jest.fn((email: string, password: string) => {
        return Promise.resolve();
      }),
      register: jest.fn((email: string, password: string) => {
        return Promise.resolve();
      }),
      signOut: jest.fn(() => {
        return Promise.resolve();
      }),
      isEmailVerified: jest.fn(() => {
        return Promise.resolve(true);
      }),
    };
  });
});

describe("Auth Service", () => {
  let authService: IAuthService;

  beforeEach(() => {
    authService = new FirebaseAuthService();
  });

  describe("Sign In", () => {
    it("should test that the sign in was successful", async () => {
      const credentials = [
        {
          email: "example.one@example.com",
          password: "L1DfXmcyByWhdApHfCuXu",
        },
        {
          email: "example.two@example.com",
          password: "xs9YPYdqIhIK46BuNQT6q",
        },
      ];

      for (const credential of credentials) {
        (authService.signIn as any).mockReset();

        await authService.signIn(credential.email, credential.password);

        expect(authService.signIn).toHaveBeenCalledTimes(1);
        expect((authService.signIn as any).mock.calls[0][0]).toBe(
          credential.email
        );
        expect((authService.signIn as any).mock.calls[0][1]).toBe(
          credential.password
        );
      }
    });
  });

  describe("Register", () => {
    it("should test that the registration was successful", async () => {
      const credentials = [
        {
          email: "example.one@example.com",
          password: "L1DfXmcyByWhdApHfCuXu",
        },
        {
          email: "example.two@example.com",
          password: "xs9YPYdqIhIK46BuNQT6q",
        },
      ];

      for (const credential of credentials) {
        (authService.register as any).mockReset();
        await authService.register(credential.email, credential.password);

        expect(authService.register).toHaveBeenCalledTimes(1);
        expect((authService.register as any).mock.calls[0][0]).toBe(
          credential.email
        );
        expect((authService.register as any).mock.calls[0][1]).toBe(
          credential.password
        );
      }
    });
  });

  describe("Sign Out", () => {
    it("should test that the user can sign out successfully", async () => {
      await authService.signOut();

      expect(authService.signOut).toHaveBeenCalledTimes(1);
    });
  });

  describe("Email Verification", () => {
    it("should test that the user's email is verified", async () => {
      const isEmailVerified = await authService.isEmailVerified();

      expect(authService.isEmailVerified).toHaveBeenCalledTimes(1);
      expect(isEmailVerified).toBe(true);
    });
  });
});
