import { Component, ViewChild } from '@angular/core';
import { VerticalSplit, NestedTree1 } from "@geosense-plus/lib-ui";

@Component({
  selector: 'app-state-directory',
  imports: [ VerticalSplit, NestedTree1 ],
  templateUrl: './state-directory.html',
  styleUrl: './state-directory.scss'
})
export class StateDirectory {
  @ViewChild('tree1') tree1: NestedTree1 | undefined;

  test1(){
    this.tree1?.expandAll();
  }
}
