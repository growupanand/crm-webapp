import { Button } from "@app/components/button";
import { useAuthStore } from "@app/stores/authStore";
import { Group, Header, Text, Title } from "@mantine/core";
import { IconLogout, IconSettings } from "@tabler/icons-react";

function AppHeader() {
  const { user, isAuthenticated, logout } = useAuthStore();
  return (
    <Header fixed={false} height="auto" py="sm">
      <Group position="apart">
        <Group position="left"></Group>
        <Group position="right">
          {isAuthenticated && user ? (
            <>
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
            </>
          )}
        </Group>
      </Group>
    </Header>
  );
}

export default AppHeader;
