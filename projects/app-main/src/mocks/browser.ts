import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * Browser MSW worker. Imported lazily from main.ts only when mocking is on,
 * so neither this module nor `msw` is ever loaded in production builds.
 */
export const worker = setupWorker(...handlers);
