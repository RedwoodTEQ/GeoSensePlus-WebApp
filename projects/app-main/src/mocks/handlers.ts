import { http, HttpResponse } from 'msw';
import type { AddGroupRequest } from '../app/api/openapi/generated';
import { db, findGroup, makeGroup, nextId } from './mock-db';

/**
 * MSW request handlers mirroring the generated OpenAPI DirectoryService
 * endpoints. Requests are typed with the generated request models
 * (AddGroupRequest, …); response payloads follow the contracts in
 * `app/api/state-directory/directory.models.ts`.
 *
 * These intercept the same URLs the app calls against the real server, so
 * flipping `useMocks` in `environments/environment.ts` switches the data
 * source without touching service code.
 */
const BASE = '/api/Directory';

export const handlers = [
  // GET subtree — the real server returns [] for unknown ids
  http.get(`${BASE}/group/:id/subtree`, ({ params }) => {
    const found = findGroup(Number(params['id']));
    return HttpResponse.json(found ? [found] : []);
  }),

  // POST group — AddGroupRequest in, created group (with server id) out
  http.post(`${BASE}/group`, async ({ request }) => {
    const body = (await request.json()) as AddGroupRequest;
    const parent = findGroup(Number(body.parentId));
    if (!parent) {
      return HttpResponse.json(
        { message: `Parent group ${body.parentId} not found` },
        { status: 404 },
      );
    }

    const created = makeGroup(nextId(), body.name ?? 'unnamed', parent.id);
    parent.children.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),
];
