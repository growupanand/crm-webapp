import { isValidMobileNumber } from "@app/utils";
import { describe, test, expect } from "@jest/globals";

describe("isValidMobileNumber tests", () => {
  test("validate a valid mobile number", () => {
    const testString = "+919876543210";
    const isStringValidMobileNumber = isValidMobileNumber(testString);
    expect(isStringValidMobileNumber).toEqual(true);
  });

  test.each(["asdf+919876543210", "9198765 43210"])(
    "validate a invalid mobile number ('%s')",
    (testString) => {
      const isStringValidMobileNumber = isValidMobileNumber(testString);
      expect(isStringValidMobileNumber).toEqual(false);
    }
  );
});
