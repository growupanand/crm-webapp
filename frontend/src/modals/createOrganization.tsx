import Form from "@app/components/form";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ModalSettings } from "@mantine/modals/lib/context";
import { Organization } from "@shared/types";

export type Props = {
  onSuccess: (organization: Organization) => void;
};

const CreateOrganizationModal = (props: Props) => {
  const form = useForm({
    initialValues: {
      name: "",
    },
  });

  return (
    <Form
      form={form}
      apiEndpoint="/organizations"
      apiMethod="POST"
      onSubmitSuccess={props.onSuccess}
      submitButtonLabel="Create Organization"
    >
      <TextInput
        required
        label="Name"
        placeholder="My Organization"
        {...form.getInputProps("name")}
      />
    </Form>
  );
};

const getCreateOrganizationModal = (props: Props) =>
  ({
    modalId: "create-organization-modal",
    title: "Create New Organization",
    children: <CreateOrganizationModal onSuccess={props.onSuccess} />,
  } as ModalSettings);

export default getCreateOrganizationModal;
