import { User } from "@app/types/user";
import { STORAGE_SUFFIX } from ".";

export const getUser = (): User | null => {
  const user = localStorage.getItem(`user.${STORAGE_SUFFIX}`);
  if (user) {
    return JSON.parse(user);
  }
  return null;
};
export const setUser = (user: User): void =>
  localStorage.setItem(`user.${STORAGE_SUFFIX}`, JSON.stringify(user));
export const removeUser = () =>
  localStorage.removeItem(`user.${STORAGE_SUFFIX}`);
