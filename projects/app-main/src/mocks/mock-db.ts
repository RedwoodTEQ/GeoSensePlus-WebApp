import type { GroupData, PointData } from '../app/api/state-directory/state-directory.http';

/**
 * In-memory mock database backing the State Directory API handlers.
 *
 * Stateful within a page session: handlers mutate these arrays directly, so
 * create/update/delete calls are reflected in subsequent reads (until reload).
 *
 * Seeded with the placeholder tree (Fruit/Vegetables) using stable ids and
 * fixed names (no random suffixes) so refresh and CRUD behave deterministically.
 * Points start empty — they are exercised once the points UI/forms land.
 */

function seedViews(): GroupData[] {
  return [
    {
      id: 1,
      name: 'Fruit@!@!@!@!@',
      isExpanded: true,
      children: [
        { id: 2, name: 'Apple!!!', isExpanded: false },
        { id: 3, name: 'Banana', isExpanded: false },
        { id: 4, name: 'Fruit loops', isExpanded: false },
      ],
    },
    {
      id: 5,
      name: 'Vegetables',
      isExpanded: false,
      children: [
        {
          id: 6,
          name: 'Green',
          isExpanded: false,
          children: [
            { id: 7, name: 'Broccoli', isExpanded: false },
            { id: 8, name: 'Brussels sprouts', isExpanded: false },
          ],
        },
        {
          id: 9,
          name: 'Orange',
          isExpanded: false,
          children: [
            { id: 10, name: 'Pumpkins', isExpanded: false },
            { id: 11, name: 'Carrots', isExpanded: false },
          ],
        },
      ],
    },
  ];
}

export const db = {
  views: seedViews(),
  points: [] as PointData[],
  nextId: 1000,
};

/** Allocate the next stable id for a created entity. */
export function nextId(): number {
  return db.nextId++;
}

/** Find a group anywhere in the tree (deep) by id. */
export function findGroup(id: number): GroupData | undefined {
  const walk = (nodes: GroupData[]): GroupData | undefined => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = walk(node.children);
        if (found) return found;
      }
    }
    return undefined;
  };
  return walk(db.views);
}

/** Remove a group from anywhere in the tree by id. Returns true if removed. */
export function removeGroup(id: number): boolean {
  const walk = (nodes: GroupData[]): boolean => {
    const i = nodes.findIndex((n) => n.id === id);
    if (i !== -1) {
      nodes.splice(i, 1);
      return true;
    }
    return nodes.some((n) => (n.children ? walk(n.children) : false));
  };
  return walk(db.views);
}

/** Reset the store back to the seed state (handy when testing mutations in dev). */
export function resetDb(): void {
  db.views = seedViews();
  db.points = [];
  db.nextId = 1000;
}
