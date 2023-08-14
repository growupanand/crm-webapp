import { Outlet } from "react-router-dom";
import { Card, Flex, Title } from "@mantine/core";

function AuthLayout() {
  return (
    <Flex align="center" justify="center" h="100vh" w="100vw" bg="gray.1">
      <Card
        shadow="md"
        bg="white"
        p="lg"
        radius="md"
        withBorder
        miw={400}
        mih={400}
      >
        <Title order={1} align="center" mb="lg">
          CRM
        </Title>
        <Outlet />
      </Card>
    </Flex>
  );
}

export default AuthLayout;
