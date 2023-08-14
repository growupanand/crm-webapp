import { STORAGE_SUFFIX } from ".";

export const getAccessToken = (): string | null =>
  localStorage.getItem(`accessToken.${STORAGE_SUFFIX}`);
export const setAccessToken = (accessToken: string): void =>
  localStorage.setItem(`accessToken.${STORAGE_SUFFIX}`, accessToken);
export const removeAccessToken = () =>
  localStorage.removeItem(`accessToken.${STORAGE_SUFFIX}`);
