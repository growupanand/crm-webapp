import Form from "@app/components/form";
import { Container, PasswordInput, TextInput } from "@mantine/core";
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
      <Form
        form={form}
        apiEndpoint="auth/register"
        apiMethod="POST"
        onSubmitSuccess={handleSubmitSuccess}
        submitButtonLabel="Register"
      >
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
        <PasswordInput label="Password" {...form.getInputProps("password")} />
        <PasswordInput
          label="Confirm password"
          {...form.getInputProps("confirmPassword")}
        />
      </Form>
    </Container>
  );
}

export default Register;
