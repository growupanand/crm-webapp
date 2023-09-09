import NavTabs, { NavTab } from "@app/components/navTabs";
import { ActionIcon, Box, Container, Drawer, Flex, Group } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconMenu2 } from "@tabler/icons-react";
import { Outlet } from "react-router-dom";

const tabs = [
  { label: "Account", path: "account" },
  { label: "Change Password", path: "change-password" },
] as NavTab[];

function SettingLayoutPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const matches = useMediaQuery("(min-width: 62em)");

  return (
    <Container size="xs" px="xs" mx={0}>
      <Flex px="lg" gap="xl" direction={matches ? "row" : "column"}>
        {matches ? (
          <Box miw="200px">
            <NavTabs tabs={tabs} onChange={close} />
          </Box>
        ) : (
          <>
            <Drawer size="xs" opened={opened} onClose={close} title="Settings">
              <NavTabs tabs={tabs} onChange={close} />
            </Drawer>
            <Group>
              <ActionIcon onClick={open}>
                <IconMenu2 />
              </ActionIcon>
            </Group>
          </>
        )}
        <Box w="100%" miw={matches ? "400px" : undefined}>
          <Outlet />
        </Box>
      </Flex>
    </Container>
  );
}

export default SettingLayoutPage;
