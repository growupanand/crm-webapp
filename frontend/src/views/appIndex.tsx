/**
 * This is index route of app "/", In our app every page route has organization id in it, If user comes to this
 *  route without organization id, we will follow below steps to redirect him to correct place:
 *
 * case 1. If user is not part of any organization, we will show modal to create organization.
 * case 2. Otherwise we will redirect him to current organization.
 *
 */

import getCreateOrganizationModal from "@app/modals/createOrganization";
import { useOrganizationStore } from "@app/stores/organizationStore";
import { modals } from "@mantine/modals";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AppIndexPage() {
  const createOrganizationModal = getCreateOrganizationModal({
    onSuccess: onOrganizationCreated,
    // prevent modal from closing when user clicks outside of it
    closeOnClickOutside: false,
    onClose: () => null,
    closeOnEscape: false,
    withCloseButton: false,
  });

  const { organizations, currentOrganization } = useOrganizationStore();
  console.log({ organizations, currentOrganization }, "Sdf");
  const navigate = useNavigate();

  function onOrganizationCreated() {
    modals.close(createOrganizationModal.modalId);
  }

  useEffect(() => {
    console.log({ organizations, currentOrganization });
    // case 1. If user has no organization, show modal to create organization
    if (organizations.length === 0) {
      modals.open(createOrganizationModal);
      return;
    }

    navigate(`/organization/${currentOrganization._id}`);
  }, [organizations]);

  return <div>Loading organization</div>;
}

export default AppIndexPage;
