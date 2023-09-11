/**
 * This is organization layout, all routes starting with "/organization/:organizationId" will be rendered inside this
 * layout. Here we will do two things:
 *
 * 1. Save current organization id as last visited organization id, so that we can redirect user to
 * last visited organization when he comes to "/" route.
 *
 * 2. We will insure the organization id in url is valid, if not we will redirect user to correct place.
 *
 */

import { useOrganizationStore } from "@app/stores/organizationStore";
import { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

function OrganizationLayout() {
  const { organizationId } = useParams();
  const { organizations, updateLastVisitedOrganizationId } =
    useOrganizationStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (organizationId) {
      updateLastVisitedOrganizationId(organizationId);
    }
  }, [organizationId]);

  useEffect(() => {
    if (
      organizationId &&
      !organizations.find((o) => o._id === organizationId)
    ) {
      // If organization id in url is not valid, redirect user to index route
      navigate("/");
    }
  }, [organizationId, organizations]);

  return (
    <>
      <Outlet />
    </>
  );
}

export default OrganizationLayout;
