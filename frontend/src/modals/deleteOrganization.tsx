import { Group, Text } from "@mantine/core";
import { ModalSettings } from "@mantine/modals/lib/context";
import { addLoadingNotification } from "@app/stores/notificationStore";
import useAPIClient from "@app/hooks/useAPIClient";
import { useState } from "react";
import { Button } from "@app/components/button";
import { modals } from "@mantine/modals";
import { useOrganizationStore } from "@app/stores/organizationStore";

export type Props = ModalSettings & {};

type State = {
  isDeleting: boolean;
};

const DeleteOrganizationModal = () => {
  const [state, setState] = useState<State>({
    isDeleting: false,
  });
  const { isDeleting } = state;
  const { client } = useAPIClient();
  const { currentOrganization, deleteOrganization } = useOrganizationStore();

  const handleDeleteOrganization = async () => {
    setState((cs) => ({ ...cs, isDeleting: true }));
    const closeNotification = addLoadingNotification("Deleting organization");
    try {
      await client(`/organizations/${currentOrganization._id}`, {
        method: "DELETE",
      });
      closeNotification("Organization deleted", "success");
      modals.close("delete-organization-modal");
      deleteOrganization(currentOrganization._id);
    } catch (error) {
      closeNotification("Error deleting organization", "error");
      setState((cs) => ({ ...cs, isDeleting: false }));
    }
  };

  const handleCancel = () => {
    modals.close("delete-organization-modal");
  };

  return (
    <>
      <Text size="lg" mb="xl">
        Are you sure you want to delete your organization{" "}
        <b>{currentOrganization?.name}</b>? This action is not reversible and
        all your organization data will be lost.
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
          onClick={handleDeleteOrganization}
          loading={isDeleting}
        >
          Delete Organization
        </Button>
      </Group>
    </>
  );
};

const getDeleteOrganizationModal = (modalProps: Props) =>
  ({
    modalId: "delete-organization-modal",
    title: <Text fw={500}>Delete organization</Text>,

    children: <DeleteOrganizationModal />,
    ...modalProps,
  } as ModalSettings);

export default getDeleteOrganizationModal;
