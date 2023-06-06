import { handleCachedError } from "@app/utils/errorHandlers";
import {
  Button,
  Container,
  Group,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useState } from "react";

type State = {
  isFormBusy: boolean;
};

function Register() {
  const [state, setState] = useState({
    isFormBusy: false,
  });

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

  const { isFormBusy } = state;

  const handleSubmit = async (formData: Record<string, any>) => {
    setState((cs) => ({ ...cs, isFormBusy: true }));
    try {
      const { confirmPassword: _, ...payload } = formData;
      await axios.post("/api/auth/register", payload);
      form.reset();
      alert("registered successfully");
    } catch (error) {
      handleCachedError(error, undefined, form.setFieldError);
    } finally {
      setState((cs) => ({ ...cs, isFormBusy: false }));
    }
  };

  return (
    <Container size="sm">
      <form onSubmit={form.onSubmit(handleSubmit)}>
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
        <Group mt="xl">
          <Button disabled={isFormBusy} loading={isFormBusy} type="submit">
            Register
          </Button>
        </Group>
      </form>
    </Container>
  );
}

export default Register;
