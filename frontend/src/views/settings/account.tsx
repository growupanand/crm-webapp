import { Button } from "@app/components/button";
import useAPIClient from "@app/hooks/useAPIClient";
import { useAuthStore } from "@app/stores/authStore";
import { addLoadingNotification } from "@app/stores/notificationStore";
import { Group, Table, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";

type State = {
  isDeleting: boolean;
};

function AccountPage() {
  const [state, setState] = useState<State>({
    isDeleting: false,
  });
  const { isDeleting } = state;

  const { user, logout } = useAuthStore();
  const { client } = useAPIClient();

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: "Delete your account",
      children: (
        <Text size="sm">
          Are you sure you want to delete your account? This action is not
          reversible and all your data will be lost.
        </Text>
      ),
      labels: {
        confirm: "Yes delete my account",
        cancel: "No don't delete it",
      },
      confirmProps: { color: "red" },
      onConfirm: handleDeleteAccount,
    });

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

  return (
    <>
      <Title order={3} mb="xs" fw="normal">
        Account
      </Title>
      <Table mb="xl">
        <tbody>
          <tr>
            <td>Name</td>
            <td>{user.name}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{user.email}</td>
          </tr>
        </tbody>
      </Table>
      <Group>
        <Button
          variant="filled"
          color="red"
          onClick={openDeleteModal}
          loading={isDeleting}
        >
          Delete Account
        </Button>
      </Group>
    </>
  );
}

export default AccountPage;
