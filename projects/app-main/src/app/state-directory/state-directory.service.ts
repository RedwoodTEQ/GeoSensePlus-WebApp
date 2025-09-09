import { Injectable } from '@angular/core';

export interface NodeData {
  name: string;
  children?: NodeData[];
}

@Injectable({
  providedIn: 'root'
})
export class StateDirectoryService {
  getRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getTreeData(): NodeData[] {
    return [
      {
        name: `Fruit-${this.getRandomInteger(0,10000)}`,
        children: [
          {name: `Apple-${this.getRandomInteger(0,10000)}`}, 
          {name: `Banana-${this.getRandomInteger(0,10000)}`},
          {name: `Fruit loops-${this.getRandomInteger(0,10000)}`}
        ],
      },
      {
        name: `Vegetables-${this.getRandomInteger(0,10000)}`,
        children: [
          {
            name: `Green-${this.getRandomInteger(0,10000)}`,
            children: [
              {name: `Broccoli-${this.getRandomInteger(0,10000)}`},
              {name: `Brussels sprouts-${this.getRandomInteger(0,10000)}`}
            ],
          },
          {
            name: `Orange-${this.getRandomInteger(0,10000)}`,
            children: [
              {name: `Pumpkins-${this.getRandomInteger(0,10000)}`}, 
              {name: `Carrots-${this.getRandomInteger(0,10000)}`}
            ],
          },
        ],
      },
    ];
  }
}