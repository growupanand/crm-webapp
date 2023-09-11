import Form from "@app/components/form";
import { useOrganizationStore } from "@app/stores/organizationStore";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ModalSettings } from "@mantine/modals/lib/context";
import { Organization } from "@app/types/organization";
import { useNavigate } from "react-router-dom";

export type Props = ModalSettings & {
  onSuccess?: (organization: Organization) => void;
};

const CreateOrganizationModal = (props: Props) => {
  const form = useForm({
    initialValues: {
      name: "",
    },
  });

  const { addOrganization } = useOrganizationStore();
  const navigate = useNavigate();

  const onSubmitSuccess = (organization: Organization) => {
    addOrganization(organization);
    navigate(`/organization/${organization._id}`);
    props.onSuccess?.(organization);
  };

  return (
    <Form
      form={form}
      apiEndpoint="/organizations"
      apiMethod="POST"
      onSubmitSuccess={onSubmitSuccess}
      submitButtonLabel="Create Organization"
      submitButtonWithFullWidth
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

const getCreateOrganizationModal = ({ onSuccess, ...modalProps }: Props) =>
  ({
    modalId: "create-organization-modal",
    title: "Create New Organization",
    children: <CreateOrganizationModal onSuccess={onSuccess} />,
    ...modalProps,
  } as ModalSettings);

export default getCreateOrganizationModal;
