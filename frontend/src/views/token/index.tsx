import useAPIClient from "@app/hooks/useAPIClient";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ResetPasswordPage from "@app/views/token/resetPassword";
import { Container, Group, Loader, Stack, Text } from "@mantine/core";
import { Button } from "@app/components/button";

type State = {
  isValidatingToken: boolean;
  tokenData: null | Record<string, any>;
};

const VALID_TOKEN_TYPES = ["resetPasswordToken"];

function TokenPage() {
  const { token } = useParams();
  const { client } = useAPIClient();

  const [state, setState] = useState<State>({
    isValidatingToken: true,
    tokenData: null,
  });
  const { isValidatingToken, tokenData } = state;
  const isInvalidToken =
    (!isValidatingToken && tokenData === null) ||
    !VALID_TOKEN_TYPES.includes(tokenData?.type);

  const getTokenPage = () => {
    let TokenTypePage;

    switch (tokenData.type) {
      case "resetPasswordToken":
        TokenTypePage = (
          <ResetPasswordPage token={token} tokenData={tokenData} />
        );
        break;

      // here we can add more token type pages

      default:
        TokenTypePage = <InvalidToken />;
        break;
    }
    return TokenTypePage;
  };

  const getTokenData = async (token: string) => {
    setState((cs) => ({ ...cs, isValidatingToken: true, tokenData: null }));
    try {
      const tokenDataResponse = await client<Record<string, any>>(
        `auth/token/${token}`,
        {}
      );
      setState((cs) => ({ ...cs, tokenData: tokenDataResponse }));
    } catch (error) {
      setState((cs) => ({ ...cs, isValidatingToken: false, tokenData: null }));
    } finally {
      setState((cs) => ({ ...cs, isValidatingToken: false }));
    }
  };

  useEffect(() => {
    if (token?.trim() !== "") {
      getTokenData(token);
    }
  }, [token]);

  if (isValidatingToken) {
    return <ValidatingToken />;
  }

  return (
    <Container size="sm">
      <Stack spacing="lg">
        {isInvalidToken ? <InvalidToken /> : getTokenPage()}
        <Group grow>
          <Button variant="light" to="/auth/login">
            Back to login
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}

const ValidatingToken = () => (
  <Group position="center" h="100%" w="100%">
    <Loader />
    <Text size="xl">Please wait</Text>
  </Group>
);

const InvalidToken = () => (
  <Group position="center">
    <Text size="xl">Invalid token</Text>
  </Group>
);

export default TokenPage;
