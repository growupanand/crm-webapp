import { Button } from "@app/components/button";
import Form, { SetFormError } from "@app/components/form";
import { User } from "@app/types/user";
import { apiClient } from "@app/utils/apiClient";
import {
  resetLocalStorage,
  setAccessToken,
  setRefreshToken,
} from "@app/utils/storage";
import { setUser } from "@app/utils/storage/user";
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
    // once login credentials validated successfully, first we will save access token and refresh token in client local storage
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    fetchUserInfo();
  };

  const fetchUserInfo = async () => {
    try {
      const userInfo = await apiClient<User>("user/me/", {});
      setUser(userInfo);
      window.location.href = "/";
    } catch (error) {
      console.log("unable to fetch user");
    }
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
          <Button variant="light" to="/register">
            Register
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}

export default Login;
