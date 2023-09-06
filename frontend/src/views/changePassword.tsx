import Form from "@app/components/form";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

function ChangePasswordPage() {
  const form = useForm({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      confirmPassword: (value, values) =>
        value !== values.newPassword || value === ""
          ? "Password not match"
          : null,
    },
  });

  const handleSubmitSuccess = async (formData: Record<string, any>) => {
    alert("password changed successfully");
    form.reset();
  };

  return (
    <Form
      form={form}
      formTitle="Change Password"
      apiEndpoint="user/change-password"
      apiMethod="POST"
      onSubmitSuccess={handleSubmitSuccess}
      submitButtonLabel="Change Password"
      submitButtonWithFullWidth
    >
      <TextInput
        label="New Password"
        type="password"
        required
        {...form.getInputProps("newPassword")}
      />
      <TextInput
        label="Confirm New Password"
        type="password"
        required
        {...form.getInputProps("confirmPassword")}
      />
    </Form>
  );
}

export default ChangePasswordPage;
