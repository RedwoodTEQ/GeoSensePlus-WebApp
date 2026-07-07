/**
 * Development environment (swapped in via angular.json `fileReplacements`).
 * Mocking is on by default so the app runs without the .NET backend.
 * Flip `useMocks` to false and restart `pnpm start` to hit the real server.
 * At runtime you can also toggle via `window.mockApi.start()/stop()`.
 */
export const environment = {
  useMocks: true,
};
