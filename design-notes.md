# Design Notes
## Reactive Form Integration - State Directory
### Overview

When a user switch to the state directory page. The frontend sends a request to
the server to get the state info. (_task_ create a service to wrap http request of getting the state info)

The state info is organized as a tree structure, so when the frontend get the
state info response, it will visualize that info as a nested tree in the left
pane of the state directory page, then the right pane will be used to show the
node details.

### System Behavior

When a user click on a tree node, the relevant form will appear on the right pane
side of state directory page. Use `point-form` for point nodes, use `group-form`
for group nodes

In the response message, the json objects for each node contain all the details
required for the forms, so when a user clicks on a node, the frontend doesn't
need to send additional request to fetch the node info.

The form is editable, so a user can make some change and submit to the server.

If no node is clicked, the right pane just display a message to indicate the
user to click a node for details.

### Right Pane Form Implementation Details

- Form component names (2 forms): `point-form` and `group-form`, they are
  independent to each other.
- Form type: both are reactive forms
- Source location: both under `lib-ui/src/lib`
- Form fields: the fields of `PointData` and `GroupData`
- The form may be reused in different pages
- The form state will be cached inside the relevant http service
- The cached data is the state of the tree and forms, so it will never expire
  unless coming with a new server refresh
- The form doesn't require auto save
- Need to track the dirty state, so that when a user trys to click to another
  node without saving the current one, a prompt dialogue will pop up.
- The form action includes: `save`, `delete`, group-form will have additional
  `add group` and `add point` buttons
  - `save` will submit the current group/point info to the server
  - `delete` will delete current group/point from the server
  - `add group` will add a new group under current group
  - `ad point` will add a new point under the current group
- Add the normal validation according the the data type of the fields
- Don't need to consider concurrency for the form updating

  Note that after each of the above action, after receiving the sccess code, the
  frontend should also update the local cache.

### Left Pane Update Details

- Add a dropdown `views` menu on the top, mouse hover to expand the menu, the menu items
  are the names of `GroupData` returned from API `GET /api/directory/views/` 

- When click the `views` menu item, the system will switch to the different trees.

- Switching different view is just another `this.tree1?.setData(..)` call

- Add a `Reload` button to re-request views from the server, especially when the
  previous request fails.

- When the system is loading, pop up a progress spinner in the centre of the page.

### Other Implementation Details

- The http request for state info should be in a separate service (in
  `state-directory.http.ts`) injected into the existing `StateDirectoryService`

- The API endpoints are:
  1.  `GET /api/directory/views/` to get all root node IDs of tree (a root node is a
      node without parent)
      - Response: a list of `GroupData`
  2.  `GET /api/directory/views/{id}` to get a full json object of a tree that the
      root node ID is `{id}`
      - Response: a `NodeData` object
  3.  `DELETE /api/directory/points/{id}` to delete a point
  4.  `PUT /api/directory/points/{id}` to update a point details
  5.  `POST /api/directory/points` to create a point
  6.  `DELETE /api/directory/groups/{id}` to delete a folder
  7.  `PUT /api/directory/groups/{id}` to update a group details
  8.  `POST /api/directory/groups` to create a child group

  (_task_ need to implement the relevant backend APIs, this task is an external dependency)

- So when switching to the state directory page, there will be 2 requests sent
  out. After getting the 1st API's response, the frontend will use it's first ID
  to sent out the 2nd request, then use the response to render the left pane
  tree.

- Need to set up a proxy config for the local backend server.

- When there's an error from the http request, both panes in the state directly
  page should be cleared, the error will be displayed using snackbar

- All the UI should be based angular material (v20)

### Data Structures

The data structures are defined in `state-directory.http.ts`:

```typescript
export interface PointData {
  id: number;
  name: string;
}

export interface GroupData {
  id: number;
  name: string;
  children?: GroupData[];
  points?: PointData[];
  isExpanded: boolean;
}
```

**Node Type Discrimination**: Groups have `children` and/or `points` arrays, points do not.

### Form Fields

- **point-form**:
  - `id` (read-only)
  - `name` (editable, required validation)

- **group-form**:
  - `id` (read-only)
  - `name` (editable, required validation)
  - `isExpanded` (editable, boolean)

### Implementation Task Breakdown

#### Phase 1: HTTP Service & API Integration
- [ ] Implement `StateDirectoryHttpService` in `state-directory.http.ts`
- [ ] Add proxy configuration for local development
- [ ] Implement error handling with snackbar notifications
- [ ] Add loading spinner overlay component

#### Phase 2: Form Components
- [ ] Create `point-form` component in `lib-ui/src/lib/forms/`
- [ ] Create `group-form` component in `lib-ui/src/lib/forms/`
- [ ] Implement form validation and dirty state tracking
- [ ] Add form actions (Save, Delete, Add Group, Add Point)
- [ ] Create dialog component for dirty state prompts

#### Phase 3: State Directory Updates
- [ ] Update `StateDirectoryService` to inject HTTP service
- [ ] Add views dropdown menu with hover functionality
- [ ] Add reload button functionality
- [ ] Update right pane to conditionally show forms
- [ ] Implement form state caching and management

#### Phase 4: Integration & Testing
- [ ] Connect all components and data flow
- [ ] Test form interactions with tree updates
- [ ] Test error scenarios and recovery
- [ ] Test view switching and form persistence

### Component Architecture

```
StateDirectoryComponent
├── StateDirectoryService
│   └── StateDirectoryHttpService
├── VerticalSplit Component
│   ├── Left Pane
│   │   ├── Views Dropdown
│   │   ├── Reload Button
│   │   └── NestedTree1 Component
│   └── Right Pane
│       ├── point-form Component (conditional)
│       ├── group-form Component (conditional)
│       └── Empty State Message
└── Loading Overlay
└── Error Snackbar
```

### Summary

**Core Architecture**
- Two forms: point-form and group-form in lib-ui/src/lib (independent)
- HTTP service: Separate state-directory.http.ts injected into existing StateDirectoryService
- Multi-view support: Dropdown menu for different tree views via /api/directory/views/
- Form behavior: Conditional display based on node type, dirty state tracking, manual save

**Data Flow**
1. Page Load: GET /api/directory/views/ → GET /api/directory/views/{first-id}
2. Node Click: Show appropriate form with cached data (no additional HTTP call)
3. Form Actions: POST/PUT/DELETE APIs with local cache updates
4. View Switching: Reload tree data using setData()

**Key Requirements**
- Form independence: point-form and group-form work separately
- Persistent cache: Tree and form state cached until server refresh
- Dirty state tracking with prompt dialog
- Form actions: Save, Delete, Add Group, Add Point
- Loading spinner during API calls
- Error handling: Clear panes and show errors with snackbar
- Proxy config for local development
- Basic validation by field data types
- Angular Material v20 for all UI components