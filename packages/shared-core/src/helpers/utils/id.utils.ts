import _ from "lodash";
import { customAlphabet, nanoid } from "nanoid";

export class IDUtils {
  public static generate(
    size = 21,
    hasSpecialCharacters = true,
    characterSet?: string
  ): string {
    if (hasSpecialCharacters) {
      return nanoid(size);
    } else {
      const defaultCharacterSet =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

      return customAlphabet(
        !_.isNil(characterSet) ? characterSet : defaultCharacterSet,
        size
      )();
    }
  }
}
