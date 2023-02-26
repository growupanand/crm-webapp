/**
 * check if provided value is in a valid mobile number format
 * @param mobileNumber string | number
 * @returns Boolean
 */
export const isValidMobileNumber = (mobileNumber: string | number) => {
  const regex = /^\+?[1-9]\d{1,14}$/;
  return regex.test(mobileNumber.toString());
};
