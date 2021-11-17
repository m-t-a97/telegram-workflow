export class RegexUtils {
  public static isDigitsOnly(text: string): boolean {
    return /^[0-9]+$/.test(text);
  }
}
