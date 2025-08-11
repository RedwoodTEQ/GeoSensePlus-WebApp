import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { VerticalSplit, NestedTree1, NodeData } from "@geosense-plus/lib-ui";

@Component({
  selector: 'app-state-directory',
  imports: [ VerticalSplit, NestedTree1 ],
  templateUrl: './state-directory.html',
  styleUrl: './state-directory.scss'
})
export class StateDirectory implements AfterViewInit {
  ngAfterViewInit(): void {
    this.setNewData();
    //this.tree1?.refresh();
  }
  @ViewChild('tree1') tree1: NestedTree1 | undefined;

  getRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  nodeClicked(nodeData: NodeData){
    console.log("nodeClicked() called: ", nodeData);
  }

  setNewData(){
    this.tree1?.setData([
      {
        name: `Fruit-${this.getRandomInteger(0,10000)}`,
        children: [
          {name: `Apple-${this.getRandomInteger(0,10000)}`}, 
          {name: `Banana-${this.getRandomInteger(0,10000)}`},
          {name: `Fruit loops-${this.getRandomInteger(0,10000)}`}],
      },
      {
        name: `Vegetables-${this.getRandomInteger(0,10000)}`,
        children: [
          {
            name: `Green-${this.getRandomInteger(0,10000)}`,
            children: [
              {name: `Broccoli-${this.getRandomInteger(0,10000)}`},
              {name: `Brussels sprouts-${this.getRandomInteger(0,10000)}`}
            ],
          },
          {
            name: `Orange-${this.getRandomInteger(0,10000)}`,
            children: [
              {name: `Pumpkins-${this.getRandomInteger(0,10000)}`}, 
              {name: `Carrots-${this.getRandomInteger(0,10000)}`}
            ],
          },
        ],
      },
    ]);
  }

  test1(){
    this.setNewData();
    this.tree1?.expandAll();
  }
}
