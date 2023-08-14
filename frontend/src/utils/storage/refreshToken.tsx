import { STORAGE_SUFFIX } from ".";

export const getRefreshToken = (): string | null =>
  localStorage.getItem(`refreshToken.${STORAGE_SUFFIX}`);
export const setRefreshToken = (refreshToken: string): void =>
  localStorage.setItem(`refreshToken.${STORAGE_SUFFIX}`, refreshToken);
export const removeRefreshToken = () =>
  localStorage.removeItem(`refreshToken.${STORAGE_SUFFIX}`);
