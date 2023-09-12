import { Group, Text } from "@mantine/core";
import { ModalSettings } from "@mantine/modals/lib/context";
import { addLoadingNotification } from "@app/stores/notificationStore";
import useAPIClient from "@app/hooks/useAPIClient";
import { logout } from "@app/utils/auth";
import { useState } from "react";
import { Button } from "@app/components/button";
import { modals } from "@mantine/modals";

export type Props = ModalSettings & {};

type State = {
  isDeleting: boolean;
};

const DeleteAccountModal = () => {
  const [state, setState] = useState<State>({
    isDeleting: false,
  });
  const { isDeleting } = state;
  const { client } = useAPIClient();
  const handleDeleteAccount = async () => {
    setState((cs) => ({ ...cs, isDeleting: true }));
    const closeNotification = addLoadingNotification("Deleting account");
    try {
      await client("/user/me", {
        method: "DELETE",
      });
      closeNotification("Account deleted", "success");
      logout();
    } catch (error) {
      closeNotification("Error deleting account", "error");
      setState((cs) => ({ ...cs, isDeleting: false }));
    }
  };

  const handleCancel = () => {
    modals.close("delete-account-modal");
  };

  return (
    <>
      <Text size="lg" mb="xl">
        Are you sure you want to delete your account? This action is not
        reversible and all your data will be lost.
      </Text>
      <Group position="apart">
        <Button
          variant="outline"
          color="gray"
          onClick={handleCancel}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          variant="filled"
          color="red"
          onClick={handleDeleteAccount}
          loading={isDeleting}
        >
          Delete Account
        </Button>
      </Group>
    </>
  );
};

const getDeleteAccountModal = (modalProps: Props) =>
  ({
    modalId: "delete-account-modal",
    title: <Text fw={500}>Delete your account</Text>,

    children: <DeleteAccountModal />,
    ...modalProps,
  } as ModalSettings);

export default getDeleteAccountModal;
