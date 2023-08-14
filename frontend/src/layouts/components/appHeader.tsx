import { Button } from "@app/components/button";
import { Group, Header, Title } from "@mantine/core";

function AppHeader() {
  return (
    <Header height="auto" p={15}>
      <Group position="apart">
        <Button variant="white" to="/">
          <Title color="black">CRM</Title>
        </Button>
        <Group position="right">
          <Button variant="light" to="/login">
            Login
          </Button>
          <Button variant="subtle" to="/register">
            Register
          </Button>
        </Group>
      </Group>
    </Header>
  );
}

export default AppHeader;
