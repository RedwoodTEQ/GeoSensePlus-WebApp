/**
 * Development environment (swapped in via angular.json `fileReplacements`).
 * Mocking is off by default so the app talks to the real .NET backend
 * through the dev-server proxy. Flip `useMocks` to true (and restart
 * `pnpm start`) to use the MSW mock data instead. At runtime you can also
 * toggle via `window.mockApi.start()/stop()`.
 */
export const environment = {
  useMocks: false,
};
