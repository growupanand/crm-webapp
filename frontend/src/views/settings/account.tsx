import { Button } from "@app/components/button";
import getDeleteAccountModal from "@app/modals/deleteAccount";
import { useAuthStore } from "@app/stores/authStore";
import { Group, Table, Title } from "@mantine/core";
import { modals } from "@mantine/modals";

function AccountPage() {
  const deleteAccountModal = getDeleteAccountModal({
    // prevent modal from closing when user clicks outside of it
    closeOnClickOutside: false,
    onClose: () => null,
    closeOnEscape: false,
    withCloseButton: false,
  });
  const { user } = useAuthStore();

  const openDeleteModal = () => modals.open(deleteAccountModal);

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
        <Button variant="filled" color="red" onClick={openDeleteModal}>
          Delete Account
        </Button>
      </Group>
    </>
  );
}

export default AccountPage;
