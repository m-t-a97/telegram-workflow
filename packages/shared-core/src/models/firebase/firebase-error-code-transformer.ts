import { FirebaseErrorCodeTypes } from "./firebase-error-code-types";

export class FirebaseErrorCodeTransformer {
  public static transform(code: FirebaseErrorCodeTypes): string {
    switch (code) {
      case FirebaseErrorCodeTypes.AUTH_USER_NOT_FOUND:
        return "This user does not exist.";

      default:
        return "Unknown error code.";
    }
  }
}
