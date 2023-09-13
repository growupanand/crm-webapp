import Form from "@app/components/form";
import { addSuccessNotification } from "@app/stores/notificationStore";
import { useOrganizationStore } from "@app/stores/organizationStore";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ModalSettings } from "@mantine/modals/lib/context";

type Props = {
  onSuccess: () => void;
};

function InviteMemberModal(props: Props) {
  const { currentOrganization } = useOrganizationStore();

  const form = useForm({
    initialValues: {
      invitedToEmail: "",
    },
  });

  const onSubmitSuccess = () => {
    addSuccessNotification("Invitation sent");
    props.onSuccess();
  };

  return (
    <>
      <Form
        form={form}
        apiEndpoint={`organizations/${currentOrganization._id}/invitations`}
        apiMethod="POST"
        onSubmitSuccess={onSubmitSuccess}
        submitButtonLabel="Invite Member"
        submitButtonWithFullWidth
      >
        <TextInput
          required
          label="Email"
          placeholder="abcd@email.com"
          type="email"
          {...form.getInputProps("invitedToEmail")}
        />
      </Form>
    </>
  );
}

const getInviteMemberModal = ({
  onSuccess,
  ...modalProps
}: Props & ModalSettings) =>
  ({
    modalId: "invite-member-modal",
    title: "Invite Member",
    children: <InviteMemberModal onSuccess={onSuccess} />,
    ...modalProps,
  } as ModalSettings);

export default getInviteMemberModal;
