import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

/** Runtime control exposed (dev only) to toggle mocking without a restart. */
interface MockApi {
  start: () => Promise<unknown>;
  stop: () => void;
}

declare global {
  interface Window {
    mockApi?: MockApi;
  }
}

/**
 * Start the MSW worker when mocking is enabled (default in dev). The worker
 * module is imported dynamically so MSW is never bundled into production.
 * `onUnhandledRequest: 'bypass'` lets any un-handled endpoint fall through to
 * the real server via the dev-server proxy.
 */
async function enableMocking(): Promise<void> {
  if (!environment.useMocks) return;

  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });

  window.mockApi = {
    start: () => worker.start({ onUnhandledRequest: 'bypass' }),
    stop: () => worker.stop(),
  };
  console.info(
    '[MSW] Mocking enabled. Toggle live with window.mockApi.start() / window.mockApi.stop()',
  );
}

enableMocking()
  .catch((err) => console.error('Failed to start MSW worker', err))
  .finally(() => {
    bootstrapApplication(App, appConfig).catch((err) => console.error(err));
  });
