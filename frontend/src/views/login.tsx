import { Button } from "@app/components/button";
import Form, { SetFormError } from "@app/components/form";
import { useAuthStore } from "@app/stores/authStore";
import { resetLocalStorage } from "@app/utils/storage";
import {
  Container,
  Divider,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

function Login() {
  const authStore = useAuthStore();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  const handlePreSubmit = () => {
    // before trying to login user we want to remove any saved access token or refresh token
    resetLocalStorage();
  };

  const handleSubmitSuccess = async (
    responseData: Record<string, any>,
    setFormError: SetFormError
  ) => {
    form.reset();
    const { accessToken, refreshToken } = responseData;
    if (
      !accessToken ||
      !refreshToken ||
      [accessToken, refreshToken].includes("")
    ) {
      setFormError("Invalid token");
      return;
    }
    // once login credentials validated successfully, we will initialize auth store
    await authStore.init(accessToken, refreshToken);
    window.location.href = "/";
  };

  return (
    <Container size="sm">
      <Stack spacing="lg">
        <Form
          form={form}
          apiEndpoint="auth/login"
          apiMethod="POST"
          onSubmitSuccess={handleSubmitSuccess}
          submitButtonLabel="Login"
          submitButtonWithFullWidth
          onPreSubmit={handlePreSubmit}
        >
          <TextInput
            label="Email"
            type="email"
            placeholder="abcd@email.com"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput label="Password" {...form.getInputProps("password")} />
        </Form>
        <Divider label="OR" labelPosition="center" />
        <Group grow>
          <Button variant="light" to="/auth/register">
            Register
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}

export default Login;
