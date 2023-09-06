import { Alert, AppShell, Box, Flex, Loader, Text } from "@mantine/core";
import AppHeader from "@app/layouts/components/appHeader";
import { useAuthStore } from "@app/stores/authStore";
import { Outlet } from "react-router-dom";
import { IconAlertCircle } from "@tabler/icons-react";
import { useEffect } from "react";

function AppLayout() {
  const { isAuthenticated, user, logout, refreshUser } = useAuthStore();
  const isUserAuthenticated = isAuthenticated && user;
  const isEmailVerified = isUserAuthenticated && user?.isEmailVerified;

  // user email is not verified, but we have access token, so we will try to refresh user details
  useEffect(() => {
    if (isUserAuthenticated && !isEmailVerified) {
      refreshUser();
    }
  }, [isUserAuthenticated, isEmailVerified, refreshUser]);

  // If user is not authenticated, redirect to login page
  if (!isUserAuthenticated) {
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
    <AppShell
      header={<AppHeader />}
      children={
        isEmailVerified ? (
          // if user is authenticated and email is verified, show the app
          <Outlet />
        ) : (
          // if user is authenticated, but his email is not verified, show a message to verify email
          <EmailNotVerified />
        )
      }
      fixed={false}
    />
  );
}

const EmailNotVerified = () => (
  <Flex align="center" justify="center">
    <Alert mb="lg" color="orange">
      <Flex align="center" gap="md">
        <IconAlertCircle size="2rem" color="orange" />
        <Text color="orange" size="xl">
          Please verify your email
        </Text>
      </Flex>
    </Alert>
  </Flex>
);

export default AppLayout;
