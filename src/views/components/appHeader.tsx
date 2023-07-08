import { Button } from "@app/components/button";
import { Group, Header, Title } from "@mantine/core";
import { Link } from "react-router-dom";

function AppHeader() {
  return (
    <Header height="auto" p={15}>
      <Group position="apart">
        <Button variant="white" to="/">
          <Title color="black">CRM</Title>
        </Button>

        <Button to="/register">Register</Button>
      </Group>
    </Header>
  );
}

export default AppHeader;
