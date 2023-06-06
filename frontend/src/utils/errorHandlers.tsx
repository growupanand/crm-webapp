import { AxiosError } from "axios";

export const getErrorMessage = (
  error: AxiosError,
  fallbackErrorMessage?: string
) => {
  let errorMessage = fallbackErrorMessage || "Something went wrong";
  const responseData = error.response.data as Record<string, any>;
  const isErrorMessageExist =
    responseData && Object.keys(error.response.data).length > 0;
  if (!isErrorMessageExist) {
    return errorMessage;
  }

  const errorFields = Object.keys(responseData);
  const isNonFieldError = errorFields.includes("nonFieldError");

  if (isNonFieldError) {
    return responseData.nonFieldError;
  }

  errorMessage += "\n";
  errorFields.forEach((errorField) => {
    errorMessage += `${errorField} : ${responseData[errorField]}\n`;
  });
  return errorMessage;
};
