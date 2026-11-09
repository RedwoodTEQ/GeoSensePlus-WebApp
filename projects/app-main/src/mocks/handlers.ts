import { http, HttpResponse } from 'msw';
import type { GroupData, PointData } from '../app/api/state-directory/state-directory.http';
import { db, nextId, findGroup, removeGroup } from './mock-db';

/**
 * MSW request handlers mirroring StateDirectoryHttpService's endpoints.
 * Match the exact URLs the service calls (note the trailing slash on `views/`).
 */
const BASE = '/api/directory';

const notFound = (message: string) =>
  HttpResponse.json({ message }, { status: 404 });

export const handlers = [
  // --- Views ---
  // GET all views (root nodes) — drives StateDirectoryService.loadData()
  http.get(`${BASE}/views/`, () => HttpResponse.json(db.views)),

  // GET a single view (full tree) by id
  http.get(`${BASE}/views/:id`, ({ params }) => {
    const id = Number(params['id']);
    const view = db.views.find((v) => v.id === id);
    return view ? HttpResponse.json(view) : notFound('View not found');
  }),

  // --- Points ---
  http.get(`${BASE}/points`, () => HttpResponse.json(db.points)),

  http.post(`${BASE}/points`, async ({ request }) => {
    const body = (await request.json()) as Omit<PointData, 'id'>;
    const point: PointData = { id: nextId(), ...body };
    db.points.push(point);
    return HttpResponse.json(point, { status: 201 });
  }),

  http.put(`${BASE}/points/:id`, async ({ params, request }) => {
    const id = Number(params['id']);
    const point = db.points.find((p) => p.id === id);
    if (!point) return notFound('Point not found');
    Object.assign(point, (await request.json()) as Partial<PointData>);
    return HttpResponse.json(point);
  }),

  http.delete(`${BASE}/points/:id`, ({ params }) => {
    const id = Number(params['id']);
    const i = db.points.findIndex((p) => p.id === id);
    if (i === -1) return notFound('Point not found');
    db.points.splice(i, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // --- Groups ---
  http.post(`${BASE}/groups`, async ({ request }) => {
    const body = (await request.json()) as Omit<GroupData, 'id'>;
    const group: GroupData = { id: nextId(), ...body };
    db.views.push(group);
    return HttpResponse.json(group, { status: 201 });
  }),

  http.put(`${BASE}/groups/:id`, async ({ params, request }) => {
    const id = Number(params['id']);
    const group = findGroup(id);
    if (!group) return notFound('Group not found');
    Object.assign(group, (await request.json()) as Partial<GroupData>);
    return HttpResponse.json(group);
  }),

  http.delete(`${BASE}/groups/:id`, ({ params }) => {
    const id = Number(params['id']);
    return removeGroup(id)
      ? new HttpResponse(null, { status: 204 })
      : notFound('Group not found');
  }),
];
