import {
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef,
  ViewChild,
  output
} from '@angular/core';
import {MatTreeModule, MatTree, MatTreeNestedDataSource} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {DragDropModule } from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';

export interface NodeData {
  id: number;
  name: string;
  children?: NodeData[];
}

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
  }

  @ViewChild('tree') tree: MatTree<NodeData> | undefined;
  nodeClicked = output<any>();
  dataSource : MatTreeNestedDataSource<NodeData> = new MatTreeNestedDataSource<NodeData>;

  childrenAccessor = (node: NodeData) => node.children ?? [];
  hasChild = (_: number, node: NodeData) => !!node.children && node.children.length > 0;
  trackByFn = (index: number, node: NodeData) => node;
  expansionKeyFn = (node: NodeData) => node.id;

  public expandAll(){
    this.tree?.expandAll();
  }
  
  public getData():NodeData[] {
    return this.dataSource.data;
  }

  public setData(newData: NodeData[]) {
    this.dataSource.data = newData;
  }

  public refresh(){
    let _data = this.dataSource.data;
    this.dataSource.data = [];
    this.dataSource.data = _data;
  }

  onClick(nodeData: NodeData){
    this.nodeClicked.emit(nodeData);
  }
}
