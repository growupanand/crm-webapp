import { Button } from "@app/components/button";
import Form from "@app/components/form";
import {
  Container,
  Divider,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

function Register() {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      confirmPassword: (value, values) =>
        value !== values.password || value === "" ? "Password not match" : null,
    },
  });

  const handleSubmitSuccess = async (formData: Record<string, any>) => {
    alert("registered successfully");
    form.reset();
  };

  return (
    <Container size="sm">
      <Stack spacing="lg">
        <Form
          form={form}
          apiEndpoint="auth/register"
          apiMethod="POST"
          onSubmitSuccess={handleSubmitSuccess}
          submitButtonLabel="Register"
          submitButtonWithFullWidth
        >
          <Stack spacing="lg">
            <TextInput
              label="Full Name"
              placeholder="Utkarsh Anand"
              required
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Email"
              type="email"
              placeholder="abcd@email.com"
              required
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              {...form.getInputProps("password")}
            />
            <PasswordInput
              label="Confirm password"
              {...form.getInputProps("confirmPassword")}
            />
          </Stack>
        </Form>
        <Divider label="OR" labelPosition="center" />
        <Group grow>
          <Button variant="light" to="/auth/login">
            Login
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}

export default Register;
