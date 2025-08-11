import {ChangeDetectionStrategy
       ,Component
       ,ChangeDetectorRef
       ,ViewChild} from '@angular/core';
import {MatTreeModule, MatTree, MatTreeNestedDataSource} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {DragDropModule } from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';

interface NodeData {
  // id: number;
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
 constructor(private cdr: ChangeDetectorRef) {
  this.dataSource.data = TREE_DATA;
 }

  @ViewChild('tree') tree: MatTree<NodeData> | undefined;
  childrenAccessor = (node: NodeData) => node.children ?? [];

  //dataSource = TREE_DATA;
  dataSource : MatTreeNestedDataSource<NodeData> = new MatTreeNestedDataSource<NodeData>;

  hasChild = (_: number, node: NodeData) => !!node.children && node.children.length > 0;

  public expandAll(){
    this.tree?.expandAll();
  }

  public refresh(){
    let _data = this.dataSource.data;
    this.dataSource.data = [];
    this.dataSource.data = _data;
  }
}
