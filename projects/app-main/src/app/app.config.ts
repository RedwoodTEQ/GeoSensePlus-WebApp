import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideApi } from './api/openapi/generated';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    // Same-origin base for the generated client: requests go to /api/... and
    // the dev-server proxy forwards them to the .NET backend (avoids CORS).
    // Without this the generated services fall back to the hardcoded
    // https://localhost:5001 base in BaseService.
    provideApi('')
  ]
};
