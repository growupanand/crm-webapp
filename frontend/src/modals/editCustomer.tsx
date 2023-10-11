import Form from "@app/components/form";
import { addSuccessNotification } from "@app/stores/notificationStore";
import { useOrganizationStore } from "@app/stores/organizationStore";
import { Customer } from "@app/types/customer";
import { Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { ModalSettings } from "@mantine/modals/lib/context";

type Props = {
  customer: Customer;
  onSuccess?: (customer: Customer) => void;
};

const EditCustomerModal = (props: Props) => {
  const { customer } = props;
  const form = useForm({
    initialValues: {
      ...customer,
    },
  });

  const { currentOrganization } = useOrganizationStore();
  const apiEndpoint = `organizations/${currentOrganization._id}/customers/${customer._id}`;

  const closeModal = () => modals.close("edit-customer-modal");

  const onSubmitSuccess = (customer: Customer) => {
    addSuccessNotification("Customer updated successfully");
    form.reset();
    closeModal();
    props.onSuccess?.(customer);
  };

  return (
    <Form
      form={form}
      apiEndpoint={apiEndpoint}
      apiMethod="PATCH"
      onSubmitSuccess={onSubmitSuccess}
      submitButtonLabel="Save"
      onCancel={closeModal}
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

const getEditCustomerModal = ({
  onSuccess,
  customer,
  ...modalProps
}: Props & ModalSettings) =>
  ({
    modalId: "edit-customer-modal",
    title: <Text fw={500}>Update customer</Text>,
    children: <EditCustomerModal onSuccess={onSuccess} customer={customer} />,
    ...modalProps,
  } as ModalSettings);

export default getEditCustomerModal;
