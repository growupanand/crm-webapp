import { generateSlug, randomStringKey } from "@app/utils";
import { describe, test, expect } from "@jest/globals";

describe("generateSlug tests", () => {
  test("slug should not have any space or special character", () => {
    const testString = "this is test string with some 234234 and *&^%$#$@%^";
    const testSlug = generateSlug(testString);
    expect(testSlug).not.toContain(" ");
    expect(testSlug).not.toMatch(/[^A-Za-z0-9-]/);
  });
});

describe("randomStringKey tests", () => {
  test("should generated string of given length", () => {
    const testString1 = randomStringKey(1);
    expect(testString1).toHaveLength(1);
    const testString2 = randomStringKey(8);
    expect(testString2).toHaveLength(8);
  });
  test("should not match to generated string", () => {
    const testString1 = randomStringKey(3);
    const testString2 = randomStringKey(3);
    expect(testString1).not.toEqual(testString2);
  });
});
