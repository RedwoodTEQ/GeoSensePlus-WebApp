import { Injectable, inject } from '@angular/core';
import { StateDirectoryStore } from './state-directory.store';

export interface NodeData {
  name: string;
  children?: NodeData[];
}

@Injectable({
  providedIn: 'root'
})
export class StateDirectoryService {
  private store = inject(StateDirectoryStore);

  getTreeData(): NodeData[] {
    this.store.loadData();
    return this.store.treeData();
  }

  refreshData(): NodeData[] {
    this.store.refreshData();
    return this.store.treeData();
  }

  clearData(): void {
    this.store.clearData();
  }
}
