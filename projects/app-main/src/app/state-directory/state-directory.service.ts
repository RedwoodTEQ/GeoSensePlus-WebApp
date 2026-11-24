import { Injectable, signal, inject } from '@angular/core';
import { NodeData } from '@geosense-plus/lib-ui';
import { firstValueFrom } from 'rxjs';
import { StateDirectoryHttpService, DirectoryGroup } from '../api';

/** The UNS tree has a single root group, id 1. */
const ROOT_GROUP_ID = 1;

/**
 * Map the API model (DirectoryGroup) to the tree's NodeData. Sub-groups
 * become child nodes; data points become leaf nodes so they still appear
 * in the tree. Expansion is client-side state (the server does not track
 * it), so `expandedIds` survives re-fetches.
 */
function toNodeData(group: DirectoryGroup, expandedIds: ReadonlySet<number>): NodeData {
  const children: NodeData[] = (group.children ?? []).map((g) => toNodeData(g, expandedIds));
  children.push(
    ...(group.dataPoints ?? []).map((p) => ({ id: p.id, name: p.name, isExpanded: false })),
  );

  return {
    id: group.id,
    name: group.name,
    isExpanded: expandedIds.has(group.id),
    children: children.length ? children : undefined,
  };
}

@Injectable({
  providedIn: 'root'
})
export class StateDirectoryService {
  private httpService = inject(StateDirectoryHttpService);

  private treeData : NodeData[] = [];
  private isLoaded = signal(false);

  /** Client-side expansion state, keyed by node id. */
  private readonly expandedIds = new Set<number>();

  getTreeData(): NodeData[] {
    return this.treeData;
  }

  getRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Load the tree from the API (GET /api/Directory/group/1/subtree),
   * mapping the DirectoryGroup subtree to NodeData. Guarded by isLoaded so
   * it only fetches once until refresh/clear resets it.
   */
  async loadData(): Promise<void> {
    if (this.isLoaded()) return;

    try {
      const subtree = await firstValueFrom(this.httpService.getSubtree(ROOT_GROUP_ID));
      this.treeData = subtree.map((g) => toNodeData(g, this.expandedIds));
    } catch (err) {
      console.error('StateDirectoryService.loadData failed', err);
      this.treeData = [];
    } finally {
      this.isLoaded.set(true);
    }
  }

  // Find the NodeData from this.treeData by `id` and update its `isExpanded`
  setExpended(id: number, expanded: boolean) {
    if (expanded) {
      this.expandedIds.add(id);
    } else {
      this.expandedIds.delete(id);
    }

    const updateNode = (nodes: NodeData[]): boolean => {
      for (const node of nodes) {
        if (node.id === id) {
          node.isExpanded = expanded;
          return true;
        }
        if (node.children && updateNode(node.children)) {
          return true;
        }
      }
      return false;
    };

    updateNode(this.treeData);
  }

  updateName(): void {
    const currentData = this.treeData;
    if (currentData.length > 0) {
      currentData[0].name = `update1-${this.getRandomInteger(0,999)}`;
      if(currentData[0].children){
        currentData[0].children[0].name = `update2-${this.getRandomInteger(0,999)}`;
      }
    }
  }

  /**
   * Create a new group on the server (POST /api/Directory/group) under
   * `parentId`, then re-fetch the tree so it reflects the server-assigned id.
   */
  async addGroup(name: string, parentId: number): Promise<void> {
    await firstValueFrom(this.httpService.addGroup({ name, parentId }));
    await this.refreshData();
  }

  /** Drop the cache and re-fetch from the API. */
  async refreshData(): Promise<void> {
    this.clearData();
    await this.loadData();
  }

  clearData(): void {
    this.treeData = [];
    this.isLoaded.set(false);
  }
}
