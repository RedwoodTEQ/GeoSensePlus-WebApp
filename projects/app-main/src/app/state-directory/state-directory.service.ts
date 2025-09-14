import { Injectable, signal } from '@angular/core';
import { NodeData } from '@geosense-plus/lib-ui';

@Injectable({
  providedIn: 'root'
})
export class StateDirectoryService {

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
        children: [
          {id: this.nextId++, name: `Apple-${this.getRandomInteger(0,10000)}`},
          {id: this.nextId++, name: `Banana-${this.getRandomInteger(0,10000)}`},
          {id: this.nextId++, name: `Fruit loops-${this.getRandomInteger(0,10000)}`}
        ],
      },
      {
        id: this.nextId++,
        name: `Vegetables-${this.getRandomInteger(0,10000)}`,
        children: [
          {
            id: this.nextId++,
            name: `Green-${this.getRandomInteger(0,10000)}`,
            children: [
              {id: this.nextId++, name: `Broccoli-${this.getRandomInteger(0,10000)}`},
              {id: this.nextId++, name: `Brussels sprouts-${this.getRandomInteger(0,10000)}`}
            ],
          },
          {
            id: this.nextId++,
            name: `Orange-${this.getRandomInteger(0,10000)}`,
            children: [
              {id: this.nextId++, name: `Pumpkins-${this.getRandomInteger(0,10000)}`},
              {id: this.nextId++, name: `Carrots-${this.getRandomInteger(0,10000)}`}
            ],
          },
        ],
      },
    ];

    this.treeData.set(data);
    this.isLoaded.set(true);
  }

  updateName(): void {
    const currentData = this.treeData();
    if (currentData.length > 0) {
      currentData[0].name = `update1-${this.getRandomInteger(0,999)}`;
      if(currentData[0].children){
        currentData[0].children[0].name = `update2-${this.getRandomInteger(0,999)}`;
      }
    }
  }

  refreshData(): void {
    this.isLoaded.set(false);
    this.loadData();
  }

  clearData(): void {
    this.treeData.set([]);
    this.isLoaded.set(false);
  }
}