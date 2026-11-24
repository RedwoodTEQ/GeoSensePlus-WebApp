/**
 * Response models for the Directory (UNS) API.
 *
 * The OpenAPI spec (gsp-server.json) does not document response schemas, so
 * the generated client returns `any` for Directory endpoints. These
 * interfaces describe the payloads the server actually emits (verified
 * against the live .NET backend) and should be kept in sync with its
 * group / data-point DTOs. Request models (AddGroupRequest, …) come from
 * the generated code under `../openapi/generated`.
 */

/** A data point (leaf) belonging to a group. */
export interface DirectoryDataPoint {
  id: number;
  name: string;
  parentId: number;
  description: string | null;
  dataChannels: unknown[];
  scalarValue: unknown;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

/**
 * A group node. `GET /api/Directory/group/{id}/subtree` returns
 * `DirectoryGroup[]` — the subtree rooted at the requested group.
 */
export interface DirectoryGroup {
  id: number;
  name: string;
  parentId: number | null;
  description: string | null;
  children: DirectoryGroup[];
  dataPoints: DirectoryDataPoint[];
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
