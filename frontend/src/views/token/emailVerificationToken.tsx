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
import { Alert, Flex, Loader, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  tokenData: Record<string, any>;
  token: string;
};

type State = {
  isVerifyingEmail: boolean;
  isVerifiedSuccess: boolean;
};

function EmailVerificationToken(props: Props) {
  const { tokenData, token } = props as Props & {
    tokenData: {
      email: string;
    };
  };
  const verifyEmailEndpoint = `auth/verifyEmail/${token}`;

  const [state, setState] = useState<State>({
    isVerifyingEmail: true,
    isVerifiedSuccess: false,
  });
  const { isVerifyingEmail, isVerifiedSuccess } = state;

  const { client } = useAPIClient();
  const navigate = useNavigate();

  const handleEmailVerifiedSuccessfully = () => {
    setTimeout(() => {
      navigate(`/auth/login`);
    }, 1000);
  };

  const handleVerifyEmail = async () => {
    setState((cs) => ({ ...cs, isVerifyingEmail: true }));
    try {
      await client<{ organization: Organization }>(verifyEmailEndpoint, {});
      setState((cs) => ({ ...cs, isVerifiedSuccess: true }));
      handleEmailVerifiedSuccessfully();
    } catch (error) {
      handleCachedError(error);
    } finally {
      setState((cs) => ({ ...cs, isVerifyingEmail: false }));
    }
  };

  useEffect(() => {
    handleVerifyEmail();
  }, []);

  if (!isVerifyingEmail && !isVerifiedSuccess) {
    return (
      <Alert color="gray">
        <Text size="xl">Unable to verify email.</Text>
      </Alert>
    );
  }

  if (!isVerifyingEmail && isVerifiedSuccess) {
    return (
      <Alert color="green">
        <Text size="xl">Email verified successfully</Text>
      </Alert>
    );
  }

  return (
    <Flex align="center" justify="center" gap="xs">
      <Loader size="sm" />
      Please wait while we verify your email
    </Flex>
  );
}

export default EmailVerificationToken;
