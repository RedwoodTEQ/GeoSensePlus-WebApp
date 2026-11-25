import {
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef,
  ViewChild,
  output,
  signal
} from '@angular/core';
import {MatTreeModule, MatTree, MatTreeNestedDataSource} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {DragDropModule } from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';

export interface NodeData {
  id: number;
  name: string;
  isExpanded: boolean;
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
  dataSource : MatTreeNestedDataSource<NodeData> = new MatTreeNestedDataSource<NodeData>;

  childrenAccessor = (node: NodeData) => node.children ?? [];
  hasChild = (_: number, node: NodeData) => !!node.children && node.children.length > 0;
  trackByFn = (index: number, node: NodeData) => node.id;
  expansionKeyFn = (node: NodeData) => node.id;

  nodeClicked = output<NodeData>();

  /** id of the last clicked node; its row stays highlighted until another node is clicked */
  selectedNodeId = signal<number | undefined>(undefined);

  onClick(nodeData: NodeData){
    this.selectedNodeId.set(nodeData.id);
    this.nodeClicked.emit(nodeData);
  }

  expandedChanged = output<{id: number, expand: boolean}>();
  onExpandedChange(nodeId: number, expanded: boolean) {
    this.expandedChanged.emit( {id: nodeId, expand: expanded} );
  }

  public expandAll(){
    this.tree?.expandAll();
  }
  
  public getData():NodeData[] {
    return this.dataSource.data;
  }

  public setData(newData: NodeData[]) {
    this.dataSource.data = newData;

    // After setting data, expand nodes that should be initially expanded
    setTimeout(() => {
      this.expandNodesBasedOnState(newData);
    });
  }

  public reloadData(newData: NodeData[] | null = null){
    let _data = this.dataSource.data;
    if (newData != null) {
      _data = newData;
    }
    this.dataSource.data = [];  // to trigger change detection to refresh UI
    this.dataSource.data = _data;
  }

  public detectChanges(){
    this.cdr.detectChanges();

    // After setting data, expand nodes that should be initially expanded
    setTimeout(() => {
      this.expandNodesBasedOnState(this.dataSource.data);
    });
  }

  private expandNodesBasedOnState(nodes: NodeData[]) {
    if (!this.tree) return;
    
    for (const node of nodes) {
      if (node.isExpanded) {
        this.tree.expand(node);
      }
      
      // Recursively check children
      if (node.children && node.children.length > 0) {
        this.expandNodesBasedOnState(node.children);
      }
    }
  }
}
