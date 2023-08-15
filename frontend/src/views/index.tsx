import { useAuthStore } from "@app/stores/authStore";
import { Box, Flex, Loader, Text } from "@mantine/core";
import { Outlet } from "react-router-dom";

function App() {
  const { isAuthenticated, user, logout } = useAuthStore();

  if (!isAuthenticated || !user) {
    logout();
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
