import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  ViewChild,
  output
} from '@angular/core';
import {MatTreeModule, MatTree, MatTreeNestedDataSource} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {DragDropModule } from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {toObservable} from '@angular/core/rxjs-interop';
import {Observable, map} from 'rxjs';

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
  data = input<NodeData[]>([]);
  private seeded = false;

  private nodesById = computed(() => this.buildIndex(this.data()));
  private nodesById$ = toObservable(this.nodesById);

  constructor() {
    effect(() => {
      const newData = this.data();
      this.dataSource.data = newData;
      if (!this.seeded && newData.length) {
        this.seeded = true;
        setTimeout(() => this.expandNodesBasedOnState(newData));
      }
    });
  }

  @ViewChild('tree') tree: MatTree<NodeData> | undefined;
  dataSource : MatTreeNestedDataSource<NodeData> = new MatTreeNestedDataSource<NodeData>;

  childrenAccessor = (node: NodeData): Observable<NodeData[]> =>
    this.nodesById$.pipe(map(byId => byId.get(node.id)?.children ?? []));
  hasChild = (_: number, node: NodeData) => !!node.children && node.children.length > 0;
  trackByFn = (index: number, node: NodeData) => node.id;
  expansionKeyFn = (node: NodeData) => node.id;

  nodeClicked = output<NodeData>();
  onClick(nodeData: NodeData){
    this.nodeClicked.emit(nodeData);
  }

  expandedChange = output<{id: number, expanded: boolean}>();
  onExpandedChange(nodeId: number, expanded: boolean) {
    this.expandedChange.emit({ id: nodeId, expanded });
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

  private buildIndex(nodes: NodeData[]): Map<number, NodeData> {
    const byId = new Map<number, NodeData>();
    const walk = (ns: NodeData[]) => {
      for (const n of ns) {
        byId.set(n.id, n);
        if (n.children) walk(n.children);
      }
    };
    walk(nodes);
    return byId;
  }
}
