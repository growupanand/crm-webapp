import Form from "@app/components/form";
import { Divider, Group, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCircleCheck } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  tokenData: Record<string, any>;
  token: string;
};

type State = {
  isResetSuccess: boolean;
};

function ResetPasswordPage(props: Props) {
  const { tokenData, token } = props;

  const [state, setState] = useState<State>({
    isResetSuccess: false,
  });
  const { isResetSuccess } = state;

  const additionalPayloadData = {
    token,
    email: tokenData.email,
  };

  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },

    validate: {
      confirmPassword: (value, values) =>
        value !== values.password || value === "" ? "Password not match" : null,
    },
  });

  const onPreSubmit = () => setState((cs) => ({ ...cs, isResetBusy: true }));

  const handleSubmitSuccess = () => {
    setState((cs) => ({ ...cs, isResetBusy: false, isResetSuccess: true }));
    setTimeout(() => {
      navigate("/auth/login");
    }, 2000);
  };

  if (isResetSuccess) {
    return <ResetSuccess />;
  }

  return (
    <>
      <Form
        form={form}
        apiEndpoint="auth/resetPassword"
        apiMethod="POST"
        onSubmitSuccess={handleSubmitSuccess}
        submitButtonLabel="Reset"
        submitButtonWithFullWidth
        additionalPayloadData={additionalPayloadData}
        onPreSubmit={onPreSubmit}
        formTitle="Reset password"
      >
        <Stack spacing="lg">
          <TextInput
            label="Password"
            type="password"
            placeholder="XXXXXXXXXXX"
            required
            {...form.getInputProps("password")}
          />
          <TextInput
            label="Confirm Password"
            type="confirmPassword"
            placeholder="XXXXXXXXXXX"
            required
            {...form.getInputProps("confirmPassword")}
          />
        </Stack>
      </Form>
      <Divider label="OR" labelPosition="center" />
    </>
  );
}

const ResetSuccess = () => (
  <Group align="center" position="center">
    <IconCircleCheck size={30} color="green" />
    <Text size="xl">Password reset successfully</Text>
  </Group>
);

export default ResetPasswordPage;
