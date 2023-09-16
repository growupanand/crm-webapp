/**
 * This page is used to accept an invitation to an organization.
 *
 * First this page will check if the invitation token is for current user.
 * If it is, then it will show a button to accept the invitation.
 *
 * If the invitation token is not for current user, then it will show an error message.
 */

import { Button } from "@app/components/button";
import useAPIClient from "@app/hooks/useAPIClient";
import { useAuthStore } from "@app/stores/authStore";
import { Organization } from "@app/types/organization";
import { handleCachedError } from "@app/utils/errorHandlers";
import { Alert, Text, Title } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  tokenData: Record<string, any>;
  token: string;
};

type State = {
  isAcceptingInvitation: boolean;
  isAcceptingInvitationSuccess: boolean;
};

function OrganizationInvitationPage(props: Props) {
  const { tokenData, token } = props as Props & {
    tokenData: {
      invitedToEmail: string;
      organization: Organization;
    };
  };
  const acceptInvitationEndpoint = `organizations/invitations/accept?token=${token}`;

  const [state, setState] = useState<State>({
    isAcceptingInvitation: false,
    isAcceptingInvitationSuccess: false,
  });
  const { isAcceptingInvitation, isAcceptingInvitationSuccess } = state;

  const { client } = useAPIClient();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const isInvitationForCurrentUser = user?.email === tokenData.invitedToEmail;

  const handleAcceptInvitationSuccess = (organization: Organization) => {
    setState((cs) => ({ ...cs, isAcceptingInvitationSuccess: true }));
    setTimeout(() => {
      navigate(`/organization/${organization._id}`);
    }, 2000);
  };

  const handleAcceptInvitation = async () => {
    setState((cs) => ({ ...cs, isAcceptingInvitation: true }));
    try {
      const { organization } = await client<{ organization: Organization }>(
        acceptInvitationEndpoint,
        {
          method: "PATCH",
          data: {
            status: "accepted",
          },
        }
      );
      handleAcceptInvitationSuccess(organization);
    } catch (error) {
      handleCachedError(error);
      setState((cs) => ({ ...cs, isAcceptingInvitation: false }));
    }
  };

  if (!isAuthenticated) {
    return (
      <Alert color="gray">
        <Text size="xl">You need to login to accept the invitation</Text>
      </Alert>
    );
  }

  if (!isInvitationForCurrentUser) {
    return (
      <Alert color="red">
        <Text size="xl">Invitation is not for current user</Text>
      </Alert>
    );
  }

  if (isAcceptingInvitationSuccess) {
    return <Alert color="green">invitation accepted successfully</Alert>;
  }

  return (
    <>
      <Text size="xl">
        You are invited to join organization{" "}
        <Title order={3}>{tokenData.organization.name}</Title>
      </Text>
      <Button
        variant="filled"
        onClick={handleAcceptInvitation}
        disabled={isAcceptingInvitation}
      >
        {isAcceptingInvitation
          ? "Accepting invitation..."
          : "Accept invitation"}
      </Button>
    </>
  );
}

export default OrganizationInvitationPage;
