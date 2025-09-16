# Design Notes

## Task Lists
- [ ] Reactive Form Integration (State Directory)
- [ ] Future Design: [Description]

---

## Reactive Form Integration - State Directory
### TODOs

- Need 2 forms, `point-form` and `group-form` (update the doc below)

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

- Form component names (2 forms): `point-form` and `group-form`
- Form type: both are reactive forms
- Source location: both under `lib-ui/src/lib`
- Form fields: the fields of `PointData` and `GroupData`
- The form may be reused in different pages
- The form state will be cached inside the relevant http service
- The form doesn't require auto save
- Need to track the dirty state, so that when a user trys to click to another
  node without saving the current one, a prompt dialogue will pop up.
- The form action includes: `save`, `delete`, group-form will have additional
  `add group` and `add point` buttons
  - `save` will submit the current group/point info to the server
  - `delete` will delete current group/point from the server
  - `add group` will add a new group under current group
  - `ad point` will add a new point under the current group

  Note that after each of the above action, after receiving the sccess code, the
  frontend should also update the local cache.

### Left Pane Update Details

- Add a dropdown `views` menu on the top, mouse hover to expand the menu, the menu items
  are the names of `NodeDataEntity` returned from API `GET /api/directory/views/` 

- When click the `views` menu item, the system will switch to the different trees.

### Other Implementation Details

- The http request for state info should be in a separate service (in
  `state-directory.http.ts`) injected into the existing `StateDirectoryService`

- The API endpoints are:
  1.  `GET /api/directory/views/` to get all root node IDs of tree (a root node is a
      node without parent)
      - Response: a list of `NodeDataEntity`
  2.  `GET /api/directory/views/{id}` to get a full json object of a tree that the
      root node ID is `{id}`
      - Response: a `NodeData` object
  3.  `DELETE /api/directory/points/{id}` to delete an edge node
  4.  `PUT /api/directory/points/{id}` to update a point details
  5.  `DELETE /api/directory/groups/{id}` to delete a folder
  6.  `PUT /api/directory/groups/{id}` to update a group details

  (_task_ need to implement the relevant backend APIs, this task is an external dependency)

- So when switching to the state directory page, there will be 2 requests sent
  out. After getting the 1st API's response, the frontend will use it's first ID
  to sent out the 2nd request, then use the response to render the left pane
  tree.

- Need to set up a proxy config for the local backend server.

- When there's an error from the http request, both panes in the state directly
  page should be cleared, and the right pane show the error message


### Testing Strategy

[TBD]