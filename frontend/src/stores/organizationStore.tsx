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
    const lastVisitedOrganizationId =
      get().lastVisitedOrganizationId || organizations[0]?._id || null;

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
}));
