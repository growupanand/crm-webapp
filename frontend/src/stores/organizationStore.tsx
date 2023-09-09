import { create } from "zustand";
import { Organization } from "@shared/types";
import { apiClient } from "@app/utils/apiClient";

type OrganizationStore = {
  /** List of organizations */
  organizations: Organization[];
  /** Fetch organizations from server */
  fetchOrganizations: () => Promise<void>;
  /** Add organization to store */
  addOrganization: (organization: Organization) => void;
  /** Initialize organization store */
  initialize: () => Promise<void>;
};

/**
 * Organization store manage organization related data,
 * this store will use useAPIClient hook to fetch data from server
 */

export const useOrganizationStore = create<OrganizationStore>((set, get) => ({
  organizations: [],
  client: apiClient,

  initialize: async () => {
    await get().fetchOrganizations();
  },

  fetchOrganizations: async () => {
    const organizations = await apiClient<Organization[]>("organizations", {
      method: "GET",
    });
    set({ organizations });
  },
  addOrganization: (organization: Organization) => {
    const { organizations } = get();
    set({ organizations: [...organizations, organization] });
  },
}));
