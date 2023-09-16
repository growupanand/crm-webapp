import { create } from "zustand";
import { Organization } from "@app/types/organization";
import { apiClient } from "@app/utils/apiClient";
import {
  getLastVisitedOrganizationId,
  setLastVisitedOrganizationId,
} from "@app/utils/storage/lastOrganization";

type OrganizationStore = {
  /** List of organizations */
  organizations: Organization[];
  /** Fetch organizations from server */
  fetchOrganizations: () => Promise<Organization[]>;
  /** Add organization to store */
  addOrganization: (organization: Organization) => void;
  /** Initialize organization store */
  initialize: () => Promise<void>;
  /** Current organization */
  currentOrganization: Organization | null;
  /** Last organization id visited */
  lastVisitedOrganizationId?: string;
  /** Update last organization id */
  updateLastVisitedOrganizationId: (id: string) => void;
  /** Get organization by id */
  getOrganizationById: (id: string) => Organization | undefined;
  /** Delete organization */
  deleteOrganization: (id: string) => void;
};

/**
 * Organization store manage organization related data,
 * this store will use useAPIClient hook to fetch data from server
 */

export const useOrganizationStore = create<OrganizationStore>((set, get) => ({
  organizations: [],
  client: apiClient,
  currentOrganization: null,
  lastVisitedOrganizationId: getLastVisitedOrganizationId(), // Get last visited organization id from local storage

  initialize: async () => {
    const { fetchOrganizations } = get();
    const organizations = await fetchOrganizations();
    let lastVisitedOrganizationId = get().lastVisitedOrganizationId;
    let currentOrganization = null;

    // If last visited organization id is not set, set it to first organization
    if (!lastVisitedOrganizationId && organizations.length > 0) {
      lastVisitedOrganizationId = organizations[0]._id;
      setLastVisitedOrganizationId(lastVisitedOrganizationId);
    }

    // If last visited organization id is set, check if it is exists in organizations list or not
    if (lastVisitedOrganizationId) {
      currentOrganization = organizations.find(
        (o) => o._id === lastVisitedOrganizationId
      );
    }

    // if last visited organization id is not exists in organizations list, set current organization to first organization
    if (!currentOrganization && organizations.length > 0) {
      currentOrganization = organizations[0];
      lastVisitedOrganizationId = currentOrganization._id;
      setLastVisitedOrganizationId(lastVisitedOrganizationId);
    }

    set((cs) => ({
      ...cs,
      organizations,
      lastVisitedOrganizationId,
      currentOrganization: organizations.find(
        (o) => o._id === lastVisitedOrganizationId
      ),
    }));
  },

  getOrganizationById: (id: string) => {
    const { organizations } = get();
    return organizations.find((o) => o._id === id);
  },

  updateLastVisitedOrganizationId: (id: string) => {
    const { getOrganizationById } = get();

    // Save last visited organization id in local storage
    setLastVisitedOrganizationId(id);

    set({
      lastVisitedOrganizationId: id,
      currentOrganization: getOrganizationById(id),
    });
  },

  fetchOrganizations: async () => {
    const organizations = await apiClient<Organization[]>("organizations", {
      method: "GET",
    });
    return organizations;
  },

  addOrganization: (organization: Organization) => {
    const { organizations } = get();
    set({
      organizations: [...organizations, organization],
      currentOrganization: organization,
    });
  },

  deleteOrganization: (id: string) => {
    const { organizations } = get();
    const updatedOrganizations = organizations.filter((o) => o._id !== id);
    set({
      organizations: updatedOrganizations,
      currentOrganization: updatedOrganizations[0] || null,
    });
  },
}));
