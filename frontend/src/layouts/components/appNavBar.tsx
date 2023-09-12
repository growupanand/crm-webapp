import { Button } from "@app/components/button";
import NavTabs, { NavTab } from "@app/components/navTabs";
import { useAuthStore } from "@app/stores/authStore";
import { ActionIcon, Group, NavLink, Navbar, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";
import getCreateOrganizationModal from "@app/modals/createOrganization";
import { useOrganizationStore } from "@app/stores/organizationStore";
import { IconLogout, IconPlus, IconSettings } from "@tabler/icons-react";

function AppNavBar() {
  const { logout, isAuthenticated, user } = useAuthStore();
  const { organizations, currentOrganization } = useOrganizationStore();

  const isUserAuthenticated = isAuthenticated && user;
  const isEmailVerified = isUserAuthenticated && user?.isEmailVerified;

  const organizationTabs = organizations.map((organization) => ({
    label: organization.name,
    path: `/organization/${organization._id}`,
    isActive: (path: string) =>
      currentOrganization && path.includes(currentOrganization._id),
  })) as NavTab[];

  const tabs = [
    {
      label: "Organizations",
      nestedTabs: [
        {
          label: "Create",
          onClick: openCreateOrganizationModal,
          Icon: <IconPlus size={20} />,
        },
        ...organizationTabs,
      ],
    },
  ] as NavTab[];
  const createOrganizationModal = getCreateOrganizationModal({
    onSuccess: onOrganizationCreated,
  });

  const navigate = useNavigate();

  function openCreateOrganizationModal() {
    modals.open(createOrganizationModal);
  }

  function onOrganizationCreated() {
    modals.close(createOrganizationModal.modalId);
  }

  return (
    <Navbar p="xs" w={300}>
      <Navbar.Section>
        <Group align="center" position="apart" mb="lg">
          <Button to="/" variant="white">
            <Text color="black" size="xl" fw={800}>
              CRM
            </Text>
          </Button>
          <ActionIcon component={Button} to="/settings">
            <IconSettings size={20} />
          </ActionIcon>
        </Group>
        <Text px="xs" truncate color="gray" size="xs">
          {isAuthenticated && user ? user.email : "Not logged in"}
        </Text>
      </Navbar.Section>
      <Navbar.Section grow mt="md">
        <NavTabs disabled={!isEmailVerified} tabs={tabs} />
      </Navbar.Section>

      <Navbar.Section color="red">
        {isAuthenticated ? (
          <NavLink icon={<IconLogout />} onClick={logout} label="Logout" />
        ) : (
          <NavLink onClick={() => navigate("/login")} label="Login" />
        )}
      </Navbar.Section>
    </Navbar>
  );
}

export default AppNavBar;
