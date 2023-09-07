import {
  ActionIcon,
  Box,
  Container,
  Drawer,
  Flex,
  Group,
  NavLink,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconMenu2 } from "@tabler/icons-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { label: "Account", path: "account" },
  { label: "Change Password", path: "change-password" },
];

function SettingLayoutPage() {
  const location = useLocation();
  const activeTab = tabs.find((tab) => location.pathname.includes(tab.path));
  const activeTabPath = activeTab?.path || "";

  const [opened, { open, close }] = useDisclosure(false);
  const matches = useMediaQuery("(min-width: 62em)");
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(`/settings/${path}`);
    close();
  };

  return (
    <Container size="xs" px="xs" mx={0}>
      <Flex px="lg" gap="xl" direction={matches ? "row" : "column"}>
        {matches ? (
          <Box miw="200px">
            <NavTabs
              activeTabPath={activeTabPath}
              onChange={handleNavigation}
            />
          </Box>
        ) : (
          <>
            <Drawer size="xs" opened={opened} onClose={close} title="Settings">
              <NavTabs
                activeTabPath={activeTabPath}
                onChange={handleNavigation}
              />
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

const NavTabs = ({ activeTabPath, onChange }: any) => {
  return (
    <>
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          active={activeTabPath === tab.path}
          onClick={() => onChange(tab.path)}
          label={tab.label}
        />
      ))}
    </>
  );
};

export default SettingLayoutPage;
