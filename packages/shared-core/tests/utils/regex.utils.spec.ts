import { RegexUtils } from "../../src/helpers/utils";

describe("Regex Utils", () => {
  describe("Digits Tests", () => {
    it("should test that the text only includes digits", () => {
      const text = "12345";

      const isDigitsOnly = RegexUtils.isDigitsOnly(text);

      expect(isDigitsOnly).toBe(true);
    });

    it("should test that the text does not include only digits", () => {
      const text = "123abc";

      const isDigitsOnly = RegexUtils.isDigitsOnly(text);

      expect(isDigitsOnly).toBe(false);
    });
  });
});
