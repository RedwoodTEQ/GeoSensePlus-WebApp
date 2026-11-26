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

/** actions offered by the node context menu */
export type TreeMenuAction = 'add' | 'delete' | 'rename';

/** emitted when a context-menu item is picked for a node */
export interface TreeMenuEvent {
  node: NodeData;
  action: TreeMenuAction;
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

  menuAction = output<TreeMenuEvent>();

  /** context menu state: the node it was opened for, at viewport coordinates */
  contextMenu = signal<{node: NodeData, x: number, y: number} | null>(null);

  /**
   * Right-click on a node: open the context menu at the cursor.
   * (No selection change: only a left-click sets the highlight.)
   * stopPropagation() keeps this opening event from reaching the menu's own
   * document-level contextmenu closer.
   */
  onContextMenu(event: MouseEvent, nodeData: NodeData) {
    event.preventDefault();   // suppress the browser's native context menu
    event.stopPropagation();  // avoid trigger closeContextMenu() immediately for (document:contextmenu)="closeContextMenu()"

    // clamp so the menu (about 170x100 px) stays inside the viewport
    const x = Math.min(event.clientX, window.innerWidth - 178);
    const y = Math.min(event.clientY, window.innerHeight - 108);

    this.contextMenu.set({node: nodeData, x, y});
  }

  onMenuItemClicked(action: TreeMenuAction) {
    const menu = this.contextMenu();
    if (menu) {
      this.contextMenu.set(null);
      this.menuAction.emit({node: menu.node, action});
    }
  }

  closeContextMenu() {
    this.contextMenu.set(null);
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
