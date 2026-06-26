export const appConfig = {
  api: {
    timeoutMs: 10_000,
    retries: 1,
  },
  pagination: {
    defaultPage: 1,
    defaultPageSize: 20,
    maxPageSize: 100,
  },
} as const;
