/**
 * The function checks if a given input is a valid mobile number.
 * @param {string | number} mobileNumber - The `mobileNumber` parameter is a string or number that
 * represents a phone number.
 * @returns A boolean value is being returned, which indicates whether the input mobile number is valid
 * or not according to the regular expression pattern.
 */
export const isValidMobileNumber = (mobileNumber: string | number): boolean => {
  const regex = /^\+?[1-9]\d{1,14}$/;
  return regex.test(mobileNumber.toString());
};

/**
 * The function checks if a given string is a valid email address using a regular expression.
 * @param {string} email - The `email` parameter is a string that represents an email address that
 * needs to be validated.
 * @returns A boolean value indicating whether the input string matches the regular expression pattern
 * for a valid email address.
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
