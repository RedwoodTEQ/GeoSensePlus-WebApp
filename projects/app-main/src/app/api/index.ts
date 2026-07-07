/**
 * Public barrel for the API-wrapping services.
 *
 * This folder is the future SDK lift-out boundary: each feature's HTTP service
 * (and its API models) lives under `./<feature>/`. When the services are
 * extracted into a standalone `lib-sdk` project, this barrel becomes its
 * public entry point.
 */
export * from './state-directory/state-directory.http';
