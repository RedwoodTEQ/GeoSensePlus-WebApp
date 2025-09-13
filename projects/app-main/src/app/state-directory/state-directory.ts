import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { VerticalSplit, NestedTree1, NodeData } from "@geosense-plus/lib-ui";
import { StateDirectoryStore } from './state-directory.store';

@Component({
  selector: 'app-state-directory',
  imports: [ VerticalSplit, NestedTree1 ],
  templateUrl: './state-directory.html',
  styleUrl: './state-directory.scss'
})
export class StateDirectory implements AfterViewInit {
  private store = inject(StateDirectoryStore);

  ngAfterViewInit(): void {
    this.setNewData();
    this.tree1?.expandAll();
  }

  @ViewChild('tree1') tree1: NestedTree1 | undefined;
  nodeClicked(nodeData: NodeData){
    console.log("nodeClicked() called: ", nodeData);
  }

  setNewData(){
    this.store.loadData();
    this.tree1?.setData(this.store.treeData());
  }

  test1(){
    this.setNewData();
    this.tree1?.expandAll();
  }

  refreshData(){
    this.store.refreshData();
    this.setNewData();
    this.tree1?.expandAll();
  }

  test2(){
    this.tree1?.getData().at(0)?.children?.push({name: "test name", children: [
      {name: "child1"},
      {name: "child2"},
    ]});
    this.tree1?.refresh();
  }

  refresh(){
    // this.tree1?.refresh();
    this.refreshData();
  }
}
