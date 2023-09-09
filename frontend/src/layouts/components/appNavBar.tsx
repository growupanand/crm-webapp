import { Button } from "@app/components/button";
import NavTabs, { NavTab } from "@app/components/navTabs";
import { useAuthStore } from "@app/stores/authStore";
import { NavLink, Navbar, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";
import { Organization } from "@shared/types";
import getCreateOrganizationModal from "@app/modals/createOrganization";
import { useOrganizationStore } from "@app/stores/organizationStore";
import { IconLogout, IconPlus } from "@tabler/icons-react";

function AppNavBar() {
  const { organizations, addOrganization } = useOrganizationStore();

  const organizationTabs = organizations.map((organization) => ({
    label: organization.name,
  }));

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
    { label: "Settings", path: "settings" },
  ] as NavTab[];
  const createOrganizationModal = getCreateOrganizationModal({
    onSuccess: onOrganizationCreated,
  });

  const { logout, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  function openCreateOrganizationModal() {
    modals.open(createOrganizationModal);
  }

  function onOrganizationCreated(organization: Organization) {
    addOrganization(organization);
    modals.close(createOrganizationModal.modalId);
  }

  return (
    <Navbar p="xs" w={300}>
      <Navbar.Section>
        <Button to="/" variant="white" mb="lg">
          <Text color="black" size="xl" fw={800}>
            CRM
          </Text>
        </Button>
        <Text px="xs" truncate color="gray" size="xs">
          {isAuthenticated && user ? user.email : "Not logged in"}
        </Text>
      </Navbar.Section>
      <Navbar.Section grow mt="md">
        <NavTabs tabs={tabs} />
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
