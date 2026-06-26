import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { VerticalSplit, NestedTree1, NodeData } from "@geosense-plus/lib-ui";
import { StateDirectoryService } from './state-directory.service';

@Component({
  selector: 'app-state-directory',
  imports: [ VerticalSplit, NestedTree1 ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './state-directory.html',
  styleUrl: './state-directory.scss'
})
export class StateDirectory {
  service = inject(StateDirectoryService);

  constructor() {
    this.service.loadData();
  }

  onNodeClicked(nodeData: NodeData){
    console.log("nodeClicked() called: ", nodeData);
  }

  updateName(){
    this.service.updateName();
  }

  addNodes(){
    this.service.addNodes();
  }

  // Regenerates node ids, which collapses the tree (expansion is keyed by id).
  // Kept as a manual reload action.
  refresh(){
    this.service.refreshData();
  }
}
