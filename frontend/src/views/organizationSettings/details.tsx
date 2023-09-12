import getDeleteOrganizationModal from "@app/modals/deleteOrganization";
import { useOrganizationStore } from "@app/stores/organizationStore";
import { Button, Group, Table, Title } from "@mantine/core";
import { modals } from "@mantine/modals";

function OrganizationSettingsDetailsPage() {
  const deleteOrganizationModal = getDeleteOrganizationModal({
    // prevent modal from closing when user clicks outside of it
    closeOnClickOutside: false,
    onClose: () => null,
    closeOnEscape: false,
    withCloseButton: false,
  });

  const { currentOrganization } = useOrganizationStore();

  const openDeleteModal = () => {
    modals.open(deleteOrganizationModal);
  };

  return (
    <>
      <Title order={3} mb="xs" fw="normal">
        Details
      </Title>
      <Table mb="xl">
        <tbody>
          <tr>
            <td>Name</td>
            <td>{currentOrganization.name}</td>
          </tr>
          <tr>
            <td>Slug</td>
            <td>{currentOrganization.slug}</td>
          </tr>
        </tbody>
      </Table>
      <Group>
        <Button variant="filled" color="red" onClick={openDeleteModal}>
          Delete Organization
        </Button>
      </Group>
    </>
  );
}

export default OrganizationSettingsDetailsPage;
