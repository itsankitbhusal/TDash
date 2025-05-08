import type { ISub, IUser } from "@/types";

export const loadSubscriptions = async (): Promise<ISub[]> => {
  const response = await fetch("/data/subscriptions.json");

  if (!response.ok) {
    throw new Error("Failed to subscription");
  }

  return await response.json();
};

export const loadUsers = async (): Promise<IUser[]> => {
  const response = await fetch("/data/users.json");

  if (!response.ok) {
    throw new Error("Failed to subscription");
  }

  return await response.json();
};
