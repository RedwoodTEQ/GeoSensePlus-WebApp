import { Injectable, signal, inject } from '@angular/core';
import { NodeData } from '@geosense-plus/lib-ui';
import { StateDirectoryHttpService, GroupData } from './state-directory.http';

@Injectable({
  providedIn: 'root'
})
export class StateDirectoryService {
  private httpService = inject(StateDirectoryHttpService);

  private treeData = signal<NodeData[]>([]);
  private isLoaded = signal(false);

  get treeDataSignal() {
    return this.treeData;
  }

  getRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private nextId: number = 1;

  loadData(): void {
    if (this.isLoaded()) return;

    const data: NodeData[] = [
      {
        id: this.nextId++,
        name: `Fruit-${this.getRandomInteger(0,10000)}`,
        isExpanded: true,
        children: [
          {id: this.nextId++, name: `Apple-${this.getRandomInteger(0,10000)}`, isExpanded: false},
          {id: this.nextId++, name: `Banana-${this.getRandomInteger(0,10000)}`, isExpanded: false},
          {id: this.nextId++, name: `Fruit loops-${this.getRandomInteger(0,10000)}`, isExpanded: false}
        ],
      },
      {
        id: this.nextId++,
        name: `Vegetables-${this.getRandomInteger(0,10000)}`,
        isExpanded: false,
        children: [
          {
            id: this.nextId++,
            name: `Green-${this.getRandomInteger(0,10000)}`,
            isExpanded: false,
            children: [
              {id: this.nextId++, name: `Broccoli-${this.getRandomInteger(0,10000)}`, isExpanded: false},
              {id: this.nextId++, name: `Brussels sprouts-${this.getRandomInteger(0,10000)}`, isExpanded: false}
            ],
          },
          {
            id: this.nextId++,
            name: `Orange-${this.getRandomInteger(0,10000)}`,
            isExpanded: false,
            children: [
              {id: this.nextId++, name: `Pumpkins-${this.getRandomInteger(0,10000)}`, isExpanded: false},
              {id: this.nextId++, name: `Carrots-${this.getRandomInteger(0,10000)}`, isExpanded: false}
            ],
          },
        ],
      },
    ];

    this.treeData.set(data);
    this.isLoaded.set(true);
  }

  updateName(): void {
    const cur = this.treeData();
    if (!cur.length) return;
    const root = cur[0];
    const children = root.children ? [...root.children] : [];
    if (children.length) {
      children[0] = {...children[0], name: `update2-${this.getRandomInteger(0,999)}`};
    }
    const newRoot = {...root, name: `update1-${this.getRandomInteger(0,999)}`, children};
    this.treeData.set([newRoot, ...cur.slice(1)]);
  }

  addNodes(): void {
    const cur = this.treeData();
    if (!cur.length) return;
    const root = cur[0];
    const children = root.children ? [...root.children] : [];
    children.push({
      id: this.nextId++,
      name: 'test name',
      isExpanded: false,
      children: [
        {id: this.nextId++, name: 'child1', isExpanded: false},
        {id: this.nextId++, name: 'child2', isExpanded: false},
      ],
    });
    const newRoot = {...root, children};
    this.treeData.set([newRoot, ...cur.slice(1)]);
  }

  refreshData(): void {
    this.isLoaded.set(false);
    this.loadData();
    this.isLoaded.set(true);
  }

  clearData(): void {
    this.treeData.set([]);
    this.isLoaded.set(false);
  }
}