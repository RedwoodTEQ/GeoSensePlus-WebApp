import { AfterViewInit, Component, ViewChild, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { VerticalSplit, NestedTree1, NodeData, TreeMenuEvent } from "@geosense-plus/lib-ui";
import { StateDirectoryService } from './state-directory.service';

@Component({
  selector: 'app-state-directory',
  imports: [ VerticalSplit, NestedTree1, JsonPipe ],
  templateUrl: './state-directory.html',
  styleUrl: './state-directory.scss'
})
export class StateDirectory implements AfterViewInit {
  private service = inject(StateDirectoryService);

  ngAfterViewInit(): void {
    this.setNewData();
  }

  @ViewChild('tree1') tree1: NestedTree1 | undefined;

  // the node clicked in the tree; its JSON is shown in the right pane
  selectedNode = signal<NodeData | null>(null);

  onNodeClicked(nodeData: NodeData){
    this.selectedNode.set(nodeData);
  }

  onExpandedChanged(data: {id: number, expand: boolean} ) {
    console.log('expansion data: ', data);
    this.service.setExpended(data.id, data.expand);
  }

  async setNewData(): Promise<void> {
    await this.service.loadData();
    this.tree1?.setData(this.service.getTreeData());
  }

  updateName(){
    this.service.updateName();
    this.tree1?.detectChanges();
  }

  /** POST a new group to the server under the first root, then refresh the tree. */
  async addNodes(): Promise<void> {
    const parentId = this.service.getTreeData()[0]?.id ?? 1;
    await this.service.addGroup(`group-${this.service.getRandomInteger(0, 999)}`, parentId);
    this.tree1?.setData(this.service.getTreeData());
  }

  /** context-menu action picked on a tree node */
  onMenuAction(event: TreeMenuEvent) {
    switch (event.action) {
      case 'add':
        void this.addGroupUnder(event.node);
        break;
      case 'delete':
      case 'rename':
        window.alert('not implemented yet');
        break;
    }
  }

  /** prompt (raw js) for a name, then POST a new group under the given node and refresh the tree */
  private async addGroupUnder(parent: NodeData): Promise<void> {
    const name = window.prompt('Enter new group name');
    if (name === null || name.trim() === '') return;

    await this.service.addGroup(name.trim(), parent.id);
    this.tree1?.reloadData(this.service.getTreeData());
  }

  // re-fetch the tree from the server and push it into the tree component
  async refresh(): Promise<void> {
    await this.service.refreshData();
    this.tree1?.reloadData(this.service.getTreeData());
  }
}
