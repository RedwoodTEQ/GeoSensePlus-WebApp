import { Injectable, signal, inject } from '@angular/core';
import { NodeData } from '@geosense-plus/lib-ui';
import { firstValueFrom } from 'rxjs';
import { StateDirectoryHttpService, GroupData } from '../api';

/**
 * Map the API model (GroupData, which may carry `points`) to the tree's
 * NodeData. Sub-groups become child nodes; points become leaf nodes so they
 * still appear in the tree.
 */
function toNodeData(group: GroupData): NodeData {
  const children: NodeData[] = [];
  if (group.children) {
    children.push(...group.children.map(toNodeData));
  }
  if (group.points) {
    children.push(
      ...group.points.map((p) => ({ id: p.id, name: p.name, isExpanded: false })),
    );
  }

  return {
    id: group.id,
    name: group.name,
    isExpanded: group.isExpanded,
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

  getTreeData(): NodeData[] {
    return this.treeData;
  }

  getRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private nextId: number = 1;

  /**
   * Load the tree from the API (GET /api/directory/views/), mapping each
   * GroupData view to NodeData. Guarded by isLoaded so it only fetches once
   * until refresh/clear resets it.
   */
  async loadData(): Promise<void> {
    if (this.isLoaded()) return;

    try {
      const views = await firstValueFrom(this.httpService.getViews());
      this.treeData = views.map(toNodeData);
    } catch (err) {
      console.error('StateDirectoryService.loadData failed', err);
      this.treeData = [];
    } finally {
      this.isLoaded.set(true);
    }
  }

  // Find the NodeData from this.data by `id` and update its `isExpanded` to `expanded`
  setExpended(id: number, expanded: boolean) {
    const currentData = this.treeData;

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

    updateNode(currentData);
    // this.treeData.set([...data]);
    //console.log();
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

  addNodes(): void {
    const currentData = this.treeData;
    if (currentData.length > 0) {
      currentData[0].children?.push({id: this.nextId++, name: "test name", isExpanded: false, children: [
        {id: this.nextId++, name: "child1", isExpanded: false},
        {id: this.nextId++, name: "child2", isExpanded: false},
      ]});
      // currentData[0].id = this.getNextId();
    }
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
