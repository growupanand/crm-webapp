import { Alert, Flex, Group, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import axios, { Method } from "axios";
import { Button } from "./button";
import { useState } from "react";
import { handleCachedError } from "@app/utils/errorHandlers";
import { IconAlertCircle } from "@tabler/icons-react";
import useAPIClient from "@app/hooks/useAPIClient";

type Props = {
  apiEndpoint: string;
  apiMethod: Method;
  /** Pass form inputs in children */
  children: React.ReactNode;
  /** Mantine form object initiated from useForm() hook */
  form: UseFormReturnType<any>;
  onSubmitSuccess?: (responseData: any, setError?: SetFormError) => void;
  onSubmitError?: (
    responseData: any,
    cachedErrorObject: Error,
    setError?: SetFormError
  ) => void;
  /** This callback will be called each time before calling api for submit form */
  onPreSubmit?: (formData: Record<string, any>) => void;
  submitButtonLabel?: string;
  submitButtonWithFullWidth?: boolean;
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

export type SetFormError = (errorMessage: string) => void;

/**
 * This component renders a form with a submit button and handles form submission using an API details passed in props.
 * This component handles basic things automatically E.g. setting field errors .
 */
function Form(props: Props) {
  const {
    apiEndpoint,
    apiMethod,
    children,
    form,
    submitButtonLabel,
    submitButtonWithFullWidth,
  } = props;

  const [state, setState] = useState<State>(defaultState);

  const { isFormBusy, isError, nonFieldError } = state;

  const { client } = useAPIClient();

  const setFormError: SetFormError = (errorMessage) => {
    setState((cs) => ({
      ...cs,
      isError: true,
      nonFieldError: errorMessage,
    }));
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    setState((cs) => ({
      ...cs,
      ...defaultState,
      isFormBusy: true,
    }));
    try {
      props.onPreSubmit?.(formData);
      const responseData = await client<any>(apiEndpoint, {
        method: apiMethod,
        data: formData,
      });
      if (props.onSubmitSuccess) {
        props.onSubmitSuccess(responseData, setFormError);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errResponseData = error.response.data;
        // if a custom error handler passed, we will pass this error to it and let it handle the error
        if (props.onSubmitError) {
          props.onSubmitError?.(errResponseData, error, setFormError);
          return;
        }

        // otherwise field errors and non field error will set automatically
        handleCachedError(error, undefined, form.setFieldError);
        if (Object.keys(errResponseData).includes("nonFieldError")) {
          setFormError(errResponseData["nonFieldError"]);
          return;
        }
      }
      // if it is unexpected error or internal server error
      console.error(error);
      setFormError("Something went wrong.");
    } finally {
      setState((cs) => ({ ...cs, isFormBusy: false }));
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {isError && nonFieldError !== "" && (
        <Alert mb="lg" color="red">
          <Flex align="center" gap="md">
            <IconAlertCircle size="1rem" color="red" />
            <Text color="red">{nonFieldError}</Text>
          </Flex>
        </Alert>
      )}
      {children}
      <Group mt="xl" grow={submitButtonWithFullWidth}>
        <Button disabled={isFormBusy} loading={isFormBusy} type="submit">
          {submitButtonLabel || "Submit"}
        </Button>
      </Group>
    </form>
  );
}

export default Form;
