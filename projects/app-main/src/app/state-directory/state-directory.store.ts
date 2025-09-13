import { Injectable, signal } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

export interface NodeData {
  name: string;
  children?: NodeData[];
}

interface StateDirectoryState {
  treeData: NodeData[];
  isLoaded: boolean;
}

const initialState: StateDirectoryState = {
  treeData: [],
  isLoaded: false
};

export const StateDirectoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    getRandomInteger(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    loadData(): void {
      if (store.isLoaded()) return;

      const data = [
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
      
      patchState(store, { treeData: data, isLoaded: true });
    },

    refreshData(): void {
      patchState(store, { isLoaded: false });
      this.loadData();
    },

    clearData(): void {
      patchState(store, { treeData: [], isLoaded: false });
    }
  }))
);
