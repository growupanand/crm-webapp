import { Button } from "@app/components/button";
import { useAuthStore } from "@app/stores/authStore";
import { Group, Header, Text, Title } from "@mantine/core";
import { IconLogout, IconSettings } from "@tabler/icons-react";

function AppHeader() {
  const { user, isAuthenticated, logout } = useAuthStore();
  return (
    <Header height="auto" py="sm">
      <Group position="apart">
        <Group position="left">
          <Button variant="white" to="/">
            <Title color="black" order={3}>
              CRM
            </Title>
          </Button>
          <Text color="gray" size="sm">
            {isAuthenticated && user ? user.email : "Not logged in"}
          </Text>
        </Group>
        <Group position="right">
          {isAuthenticated && user ? (
            <>
              <Button
                leftIcon={<IconSettings />}
                to="/settings"
                variant="white"
              >
                Settings
              </Button>
              <Button
                leftIcon={<IconLogout />}
                variant="white"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="light" to="/login">
                Login
              </Button>
              <Button variant="subtle" to="/register">
                Register
              </Button>
            </>
          )}
        </Group>
      </Group>
    </Header>
  );
}

export default AppHeader;
