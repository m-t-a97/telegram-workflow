import { IDUtils } from "../../src/helpers/utils";

describe("ID Utils", () => {
  it("should test that the default calling of the generate method returns a size of 21 characters", () => {
    expect(IDUtils.generate()).toHaveLength(21);
  });

  it("should test that given a custom character set, it should return only characters with that given set", () => {
    const regex = new RegExp(/^[ABC123]+$/);

    const uniqueId = IDUtils.generate(5, false, "ABC123");

    expect(uniqueId).toHaveLength(5);
    expect(regex.test(uniqueId)).toBe(true);
  });
});
