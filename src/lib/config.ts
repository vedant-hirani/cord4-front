// ── Centralised runtime config ───────────────────────────────
// All env vars are read here. Import from this file — never read
// import.meta.env directly in service/component files.

export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
  appEnv:     (import.meta.env.VITE_APP_ENV ?? 'production') as string,
  isDev:      import.meta.env.DEV as boolean,
} as const;
