import { Alert, Group } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import axios, { Method } from "axios";
import { Button } from "./button";
import { useState } from "react";
import { handleCachedError } from "@app/utils/errorHandlers";
import { IconAlertCircle } from "@tabler/icons-react";

type Props = {
  apiEndpoint: string;
  apiMethod: Method;
  /** Pass form inputs in children */
  children: React.ReactNode;
  /** mantine form object initiated from useForm */
  form: UseFormReturnType<any>;
  onSubmitSuccess?: (responseData: any) => void;
  onSubmitError?: (responseData: any, cachedErrorObject: Error) => void;
  /** This callback will be called each time before calling api for submit form */
  onPreSubmit?: (formData: Record<string, any>) => void;
  submitButtonLabel?: string;
};

type State = {
  isFormBusy: boolean;
  isError: boolean;
  nonFieldError: string;
};

const defaultState = {
  isFormBusy: false,
  isError: false,
  nonFieldError: "",
};

/**
 * This component renders a form with a submit button and handles form submission using an API details passed in props.
 * This component handles basic things automatically E.g. setting field errors .
 */
function Form(props: Props) {
  const { apiEndpoint, apiMethod, children, form, submitButtonLabel } = props;

  const [state, setState] = useState<State>(defaultState);

  const { isFormBusy, isError, nonFieldError } = state;

  const handleSubmit = async (formData: Record<string, any>) => {
    setState((cs) => ({
      ...cs,
      ...defaultState,
      isFormBusy: true,
    }));
    try {
      props.onPreSubmit?.(formData);
      const responseData = await axios({
        url: apiEndpoint,
        method: apiMethod,
        data: formData,
      });
      if (props.onSubmitSuccess) {
        props.onSubmitSuccess(responseData.data);
        return;
      }
      alert("success");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response.data;
        // if you want to handle form submit error
        if (props.onSubmitError) {
          props.onSubmitError?.(responseData, error);
          return;
        }

        // otherwise field errors and non field error will set automatically
        handleCachedError(error, undefined, form.setFieldError);
        if (Object.keys(responseData).includes("nonFieldError")) {
          setState((cs) => ({
            ...cs,
            isError: true,
            nonFieldError: responseData["nonFieldError"],
          }));
        }
        // if it is unexpected error or internal server error
        if (error.response.status >= 500 && error.response.status < 600) {
          setState((cs) => ({
            ...cs,
            isError: true,
            nonFieldError: "Something went wrong.",
          }));
        }
      }
    } finally {
      setState((cs) => ({ ...cs, isFormBusy: false }));
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {isError && nonFieldError !== "" && (
        <Alert
          mb="lg"
          icon={<IconAlertCircle size="1rem" />}
          title="Error"
          color="red"
        >
          {nonFieldError}
        </Alert>
      )}
      {children}
      <Group mt="xl">
        <Button disabled={isFormBusy} loading={isFormBusy} type="submit">
          {submitButtonLabel || "Submit"}
        </Button>
      </Group>
    </form>
  );
}

export default Form;
