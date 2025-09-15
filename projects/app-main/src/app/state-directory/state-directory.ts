import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { VerticalSplit, NestedTree1, NodeData } from "@geosense-plus/lib-ui";
import { StateDirectoryService } from './state-directory.service';

@Component({
  selector: 'app-state-directory',
  imports: [ VerticalSplit, NestedTree1 ],
  templateUrl: './state-directory.html',
  styleUrl: './state-directory.scss'
})
export class StateDirectory implements AfterViewInit {
  private service = inject(StateDirectoryService);

  ngAfterViewInit(): void {
    this.setNewData();
    // this.tree1?.expandAll();
  }

  @ViewChild('tree1') tree1: NestedTree1 | undefined;

  onNodeClicked(nodeData: NodeData){
    console.log("nodeClicked() called: ", nodeData);
  }

  onExpandedChanged(data: {id: number, expand: boolean} ) {
    console.log('expansion data: ', data);
    this.service.setExpended(data.id, data.expand);
  }

  setNewData(){
    this.service.loadData();
    this.tree1?.setData(this.service.treeDataSignal());
  }

  updateName(){
    this.service.updateName();
    this.tree1?.setData(this.service.treeDataSignal());
  }

  refreshData(){
    this.service.refreshData();
    this.setNewData();
    // this.tree1?.expandAll();
  }

  private nextId: number = 1000;

  addNodes(){
    this.tree1?.getData().at(0)?.children?.push({id: this.nextId++, name: "test name", isExpanded: false, children: [
      {id: this.nextId++, name: "child1", isExpanded: false},
      {id: this.nextId++, name: "child2", isExpanded: false},
    ]});
    this.tree1?.refresh();
  }

  refresh(){
    // this.tree1?.refresh();
    this.refreshData();
  }
}
