import { STORAGE_SUFFIX } from ".";

export const getLastVisitedOrganizationId = (): string | null => {
  const lastVisitedOrganizationId = localStorage.getItem(
    `lastVisitedOrganizationId.${STORAGE_SUFFIX}`
  );
  if (lastVisitedOrganizationId) {
    return lastVisitedOrganizationId;
  }
  return null;
};

export const setLastVisitedOrganizationId = (organizationId: string): void =>
  localStorage.setItem(
    `lastVisitedOrganizationId.${STORAGE_SUFFIX}`,
    organizationId
  );

export const removeLastVisitedOrganizationId = () =>
  localStorage.removeItem(`lastVisitedOrganizationId.${STORAGE_SUFFIX}`);
