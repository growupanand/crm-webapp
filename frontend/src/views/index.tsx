import { getAccessToken } from "@app/utils/storage";
import { getUser } from "@app/utils/storage/user";
import { Box, Flex, Loader, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

type State = {
  isAuthenticated: boolean;
};

function App() {
  const user = getUser();

  const [state, setState] = useState<State>({
    isAuthenticated: !!user,
  });

  const { isAuthenticated } = state;

  const redirectToLogin = () => {
    window.location.href = "/login";
  };

  useEffect(() => {
    setState((cs) => ({
      ...cs,
      isAuthenticated: !!user,
    }));
  }, [user]);

  if (!isAuthenticated) {
    redirectToLogin();
    return (
      <Flex w="100%" h="100vh" align="center" justify="center" gap="md">
        <Text fw="lighter" size="xl">
          Redirecting to login
        </Text>
        <Box>
          <Loader variant="dots" color="gray" size="sm" />
        </Box>
      </Flex>
    );
  }

  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
