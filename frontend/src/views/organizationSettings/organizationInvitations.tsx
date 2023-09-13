import { Button } from "@app/components/button";
import getInviteMemberModal from "@app/modals/inviteMember";
import { Group, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconSend } from "@tabler/icons-react";

function OrganizationInvitations() {
  const inviteMemberModal = getInviteMemberModal({
    onSuccess: () => {
      modals.close("invite-member-modal");
    },
  });

  const openInviteMemberModal = () => {
    modals.open(inviteMemberModal);
  };

  return (
    <>
      <Group position="apart" align="center">
        <Title order={3} mb="xs" fw="normal">
          Invitations
        </Title>
        <Button
          variant="outline"
          onClick={openInviteMemberModal}
          leftIcon={<IconSend size={20} />}
        >
          Invite Member
        </Button>
      </Group>
    </>
  );
}

export default OrganizationInvitations;
