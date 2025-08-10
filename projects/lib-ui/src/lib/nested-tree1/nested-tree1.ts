import {ChangeDetectionStrategy
       ,Component
       ,ChangeDetectorRef
       ,ViewChild} from '@angular/core';
import {MatTreeModule, MatTree} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {DragDropModule } from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';

import { MatTreeNestedDataSource } from '@angular/material/tree';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface NodeData {
  name: string;
  children?: NodeData[];
}

const TREE_DATA: NodeData[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];


@Component({
  selector: 'lib-nested-tree1',
  imports: [
    MatTreeModule,
    MatButtonModule, 
    MatIconModule, 
    DragDropModule,
    CommonModule    // _note: for json pipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nested-tree1.html',
  styleUrl: './nested-tree1.scss'
})
export class NestedTree1 {
 constructor(private cdr: ChangeDetectorRef) {}

  @ViewChild('tree') tree: MatTree<NodeData> | undefined;
  childrenAccessor = (node: NodeData) => node.children ?? [];

  dataSource = TREE_DATA;
  dragNode: NodeData | null = null;

  hasChild = (_: number, node: NodeData) => !!node.children && node.children.length > 0;

  // Called when drag starts
  dragStart(node: NodeData) {
    this.dragNode = node;
  }
}
