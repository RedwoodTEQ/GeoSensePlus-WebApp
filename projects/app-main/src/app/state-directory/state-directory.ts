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
    this.tree1?.setData(this.service.getTreeData());
  }

  updateName(){
    this.service.updateName();
    this.tree1?.detectChanges();
  }

  refreshData(){
    this.service.refreshData();
    this.setNewData();
  }

  private nextId: number = 1000;

  addNodes(){
    this.service.addNodes();
    this.tree1?.reloadData();
  }

  refresh(){
    this.tree1?.reloadData();
  }
}
