export const userKeys = {
  all: ["user"] as const,
  me: () => ["user", "me"] as const,
};