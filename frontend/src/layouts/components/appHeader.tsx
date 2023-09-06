import { Button } from "@app/components/button";
import { useAuthStore } from "@app/stores/authStore";
import { Group, Header, Title } from "@mantine/core";

function AppHeader() {
  const { user, isAuthenticated, logout } = useAuthStore();
  return (
    <Header height="auto" p={15}>
      <Group position="apart">
        <Button variant="white" to="/">
          <Title color="black">CRM</Title>
        </Button>
        <Group position="right">
          {isAuthenticated && user ? (
            <Button variant="light" onClick={logout}>
              Logout
            </Button>
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
