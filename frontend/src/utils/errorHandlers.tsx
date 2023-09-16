import { addErrorNotification } from "@app/stores/notificationStore";
import { SetFieldError } from "@mantine/form/lib/types";
import { AxiosError } from "axios";

/**
 * By passing this function, all field's error messages can be displayed next to the relevant fields in the form,
 * providing a better user experience. 
 * @param error - Cached error object
 * @param fallbackErrorMessage - Display a custom message if nonFieldError not found in response
 * @param setFieldError - This is a mantine form component function that is used to set an error message for a specific field in a form.

 *
 * @returns `void`
 */
export const handleCachedError = (
  error: AxiosError,
  fallbackErrorMessage?: string,
  setFieldError?: SetFieldError<Record<string, any>>
): void => {
  let errorMessage = fallbackErrorMessage || "Something went wrong";
  const responseData = error.response.data as Record<string, any>;
  const isErrorMessageExist =
    responseData &&
    typeof responseData === "object" &&
    Object.keys(error.response.data).length > 0;

  if (isErrorMessageExist) {
    const errorFields = Object.keys(responseData);

    // If setFieldError is passed, then set the error message for the relevant field
    if (setFieldError) {
      errorFields.forEach((errorField) => {
        setFieldError(errorField, responseData[errorField]);
      });
      return;
    }

    // If setFieldError is not passed, then display the error message in an alert box
    if (errorFields.includes("nonFieldError")) {
      errorMessage = responseData.nonFieldError;
    } else {
      errorMessage += "\n";
      errorFields.forEach((errorField) => {
        errorMessage += `${errorField} : ${responseData[errorField]}\n`;
      });
    }
  }
  return addErrorNotification(errorMessage);
};
