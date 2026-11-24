import type { DirectoryDataPoint, DirectoryGroup } from '../app/api/state-directory/directory.models';

/**
 * In-memory mock database backing the Directory (UNS) API handlers.
 *
 * Stateful within a page session: handlers mutate the tree directly, so
 * create/update/delete calls are reflected in subsequent reads (until reload).
 *
 * Seeded to mirror the live .NET backend's payload exactly (field names,
 * nulls, the 0001-01-01 epoch timestamps) with stable ids and fixed names
 * (no random suffixes) so refresh and CRUD behave deterministically.
 */

/** .NET's default DateTime, as serialized by the real server. */
const EPOCH = '0001-01-01T00:00:00+00:00';

function point(id: number, name: string, parentId: number): DirectoryDataPoint {
  return {
    id,
    name,
    parentId,
    description: null,
    dataChannels: [],
    scalarValue: null,
    createdAt: EPOCH,
    updatedAt: EPOCH,
    isDeleted: false,
  };
}

/** Factory used by both the seed and the POST /group handler. */
export function makeGroup(id: number, name: string, parentId: number | null): DirectoryGroup {
  return {
    id,
    name,
    parentId,
    description: null,
    children: [],
    dataPoints: [],
    createdAt: EPOCH,
    updatedAt: EPOCH,
    isDeleted: false,
  };
}

function seedTree(): DirectoryGroup[] {
  const root = makeGroup(1, 'Root', null);
  const child = makeGroup(2, 'Child', 1);
  child.dataPoints.push(point(1, 'TestPoint', 2));

  const areaA = makeGroup(3, 'Area-A', 1);
  const line1 = makeGroup(4, 'Line-1', 3);
  line1.dataPoints.push(point(2, 'Temperature', 4), point(3, 'Pressure', 4));
  areaA.children.push(line1);

  root.children.push(child, areaA);
  return [root];
}

export const db = {
  tree: seedTree(),
  nextId: 100,
};

/** Allocate the next stable id for a created entity. */
export function nextId(): number {
  return db.nextId++;
}

/** Find a group anywhere in the tree (deep) by id. */
export function findGroup(id: number): DirectoryGroup | undefined {
  const walk = (nodes: DirectoryGroup[]): DirectoryGroup | undefined => {
    for (const node of nodes) {
      if (node.id === id) return node;
      const found = walk(node.children);
      if (found) return found;
    }
    return undefined;
  };
  return walk(db.tree);
}

/** Reset the store back to the seed state (handy when testing mutations in dev). */
export function resetDb(): void {
  db.tree = seedTree();
  db.nextId = 100;
}
