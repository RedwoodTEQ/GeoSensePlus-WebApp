# Plan: Signal-driven auto-refresh for `NestedTree1`

## Goal
Make `NestedTree1` auto-refresh from `StateDirectoryService`'s signal so the
`StateDirectory` component no longer manually calls `setData()` / `refresh()`.
The service signal becomes the single source of truth for the tree.

## Context & Constraints
- Angular 20.1 — full signal API available (`input()`, `effect()`, `viewChild()`).
- `NestedTree1` has exactly ONE consumer (`StateDirectory`); its public API can change freely.
- No Storybook stories; only `should create` smoke specs (`nested-tree1.spec.ts`, `state-directory.spec.ts`).
- Signals compare by reference and the tree uses `trackBy: node.id` + `[expansionKey]`.
  => Service mutations MUST produce a NEW top-level array AND new node objects for changed
  nodes, while PRESERVING `id`s, so reactivity fires and the tree re-renders correctly.

## Decisions
1. **Mechanism:** `NestedTree1` exposes `data = input<NodeData[]>([])`, synced to
   `dataSource.data` inside an `effect()`. Parent binds `[data]="service.treeDataSignal()"`.
2. **Scope:** Full single-source refactor — `addNodes()` moves into the service;
   remove the lib's `setData`/`getData`/`refresh`/`expandAll` and the `expandedChanged` output.
3. **Expansion:** MatTree `expansionKey` (= `node.id`) owns persistence across updates;
   seed initial expansion ONCE from `node.isExpanded` inside the effect; drop the
   `(expandedChange)` -> `setExpended` round-trip.

## Known limitation
Any future update that regenerates node `id`s will collapse the tree and will NOT re-seed,
because expansion is keyed by `id` and seeding runs only once. The service's `refreshData()`
does regenerate ids, but it is currently NEVER wired to any button (the `refresh` button only
called the now-obsolete `tree1.refresh()`). Acceptable today; documented for the implementer.

---

## Tasks

### 1. `projects/lib-ui/src/lib/nested-tree1/nested-tree1.ts`
- Imports: add `input`, `effect` from `@angular/core`. Remove `ChangeDetectorRef`
  (no longer needed once manual refresh is gone) and drop the constructor param.
- Keep `@ViewChild('tree') tree` (still used by `expandNodesBasedOnState`).
- Add:
  - `data = input<NodeData[]>([]);`
  - `private seeded = false;`
- Add constructor `effect()`:
  ```ts
  constructor() {
    effect(() => {
      const newData = this.data();
      this.dataSource.data = newData;
      if (!this.seeded && newData.length) {
        this.seeded = true;
        setTimeout(() => this.expandNodesBasedOnState(newData));
      }
    });
  }
  ```
- Remove: `setData`, `getData`, `refresh`, `expandAll`, `expandedChanged` output,
  `onExpandedChange`, and the `ChangeDetectorRef` injection.
- Keep: `dataSource`, `childrenAccessor`, `hasChild`, `trackByFn`, `expansionKeyFn`,
  `nodeClicked` output + `onClick`, private `expandNodesBasedOnState`, `@ViewChild('tree')`.

### 2. `projects/lib-ui/src/lib/nested-tree1/nested-tree1.html`
- Remove `(expandedChange)="onExpandedChange(node.id, $event)"` from the expandable
  `<mat-nested-tree-node>` (MatTree manages toggling via `matTreeNodeToggle` + `expansionKey`).
- Keep `[expansionKey]="expansionKeyFn"`, `[trackBy]="trackByFn"`, `(click)="onClick(node)"`.

### 3. `projects/app-main/src/app/state-directory/state-directory.service.ts`
Make all mutations immutable (new arrays + new node objects, ids preserved):
- **`updateName()`** — rebuild immutably, e.g.:
  ```ts
  updateName(): void {
    const cur = this.treeData();
    if (!cur.length) return;
    const root = cur[0];
    const children = root.children ? [...root.children] : [];
    if (children.length) children[0] = { ...children[0], name: `update2-${this.getRandomInteger(0,999)}` };
    const newRoot = { ...root, name: `update1-${this.getRandomInteger(0,999)}`, children };
    this.treeData.set([newRoot, ...cur.slice(1)]);
  }
  ```
- **`addNodes()`** (NEW public method, moved from the component) — append a new child
  to the first root's children immutably, using `this.nextId`; finish with `this.treeData.set(...)`.
- **Remove** `setExpended(...)` entirely.
- Keep: `loadData`, `clearData`, `refreshData`, `isLoaded`, `treeDataSignal` getter, `nextId`.

### 4. `projects/app-main/src/app/state-directory/state-directory.ts`
- Make `service` public (so the template can read `service.treeDataSignal()`).
- Remove `@ViewChild('tree1') tree1`. Drop `AfterViewInit`/`ngAfterViewInit`.
- Call initial load in the constructor: `this.service.loadData();`
- Simplify handlers to delegate:
  - `updateName()` -> `this.service.updateName();`
  - `addNodes()` -> `this.service.addNodes();`
  - `refresh()` -> remove (obsolete), OR call `this.service.refreshData();` (regenerates ids -> tree collapses; document this).
  - Remove `setNewData()` and `onExpandedChanged()`.
  - Keep `onNodeClicked(node)` (logging).
- Remove the component's own `nextId` field (lives only in the service now).
- Remove `NestedTree1` from the import if no longer referenced as a type (still needed in `imports` array of the `@Component`).

### 5. `projects/app-main/src/app/state-directory/state-directory.html`
- `<lib-nested-tree1 [data]="service.treeDataSignal()" (nodeClicked)="onNodeClicked($event)"></lib-nested-tree1>`
- Remove `(expandedChanged)="onExpandedChanged($event)"`.
- Buttons: keep `updateName`, `addNodes`; decide on `refresh` (remove, or keep -> `refreshData()` with documented collapse behavior).

### 6. (Optional) `state-directory.ts`
- Add `changeDetection: ChangeDetectionStrategy.OnPush` for efficiency and consistency with
  the lib component. Signal bindings stay reactive. Optional but recommended.

---

## Validation
- `npm run build:all` — must compile / typecheck (lib-ui, lib-core, app-main).
- `npm test` — smoke specs (`should create`) stay green.
- Manual via `npm start`:
  1. Tree loads; "Fruit" is expanded (initial seed from `isExpanded: true`).
  2. Click "update name" -> names change reactively; no extra refresh needed.
  3. Click "add nodes" -> new child appears reactively under the first root.
  4. **Collapse** a node, then click "update name" -> it STAYS collapsed (no re-expand).
  5. **Expand** a seeded-collapsed node, then click "add nodes" -> it STAYS expanded.
  6. Console shows only `nodeClicked` logs; the old `setData() called...` log is gone.

## Open / Out of scope
- `refresh` button semantics (regenerate ids -> collapse). Pick: remove button, or keep as `refreshData()` with documented behavior.
- HTTP integration (`StateDirectoryHttpService`) is untouched.
- No new automated tests required beyond keeping smoke specs green; an optional follow-up could add a signal-reactivity spec for `StateDirectoryService`.
