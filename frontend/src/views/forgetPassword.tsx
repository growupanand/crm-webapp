import { Button } from "@app/components/button";
import Form from "@app/components/form";
import { Container, Divider, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

function ForgetPassword() {
  const form = useForm({
    initialValues: {
      email: "",
    },
  });

  const handleSubmitSuccess = async () => {
    form.reset();
    alert("Password reset link sent to you mail.");
  };

  return (
    <Container size="sm">
      <Stack spacing="lg">
        <Form
          form={form}
          apiEndpoint="auth/resetPassword"
          apiMethod="POST"
          onSubmitSuccess={handleSubmitSuccess}
          submitButtonLabel="Submit"
          submitButtonWithFullWidth
        >
          <Stack spacing="lg">
            <TextInput
              label="Email"
              type="email"
              placeholder="abcd@email.com"
              required
              {...form.getInputProps("email")}
            />
          </Stack>
        </Form>
        <Divider label="OR" labelPosition="center" />
        <Group grow>
          <Button variant="light" to="/auth/login">
            Back to login
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}

export default ForgetPassword;
