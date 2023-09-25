import Form from "@app/components/form";
import { addSuccessNotification } from "@app/stores/notificationStore";
import { useOrganizationStore } from "@app/stores/organizationStore";
import { Customer } from "@app/types/customer";
import { Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { ModalSettings } from "@mantine/modals/lib/context";

type Props = {
  onSuccess?: (customer: Customer) => void;
};

const CreateCustomerModal = (props: Props) => {
  const form = useForm({
    initialValues: {
      name: "",
      mobileNumber: "",
    },
  });

  const { currentOrganization } = useOrganizationStore();
  const apiEndpoint = `organizations/${currentOrganization._id}/customers`;

  const onSubmitSuccess = (customer: Customer) => {
    addSuccessNotification("Customer created successfully");
    form.reset();
    modals.close("create-customer-modal");
    props.onSuccess?.(customer);
  };

  return (
    <Form
      form={form}
      apiEndpoint={apiEndpoint}
      apiMethod="POST"
      onSubmitSuccess={onSubmitSuccess}
      submitButtonLabel="Create customer"
      submitButtonWithFullWidth
    >
      <Stack spacing="md">
        <TextInput
          required
          label="Name"
          placeholder="Customer name"
          {...form.getInputProps("name")}
        />

        <TextInput
          required
          label="Mobile Number"
          placeholder="Mobile number"
          type="tel"
          {...form.getInputProps("mobileNumber")}
        />
      </Stack>
    </Form>
  );
};

const getCreateCustomerModal = ({
  onSuccess,
  ...modalProps
}: Props & ModalSettings) =>
  ({
    modalId: "create-customer-modal",
    title: <Text fw={500}>Create New customer</Text>,
    children: <CreateCustomerModal onSuccess={onSuccess} />,
    ...modalProps,
  } as ModalSettings);

export default getCreateCustomerModal;
