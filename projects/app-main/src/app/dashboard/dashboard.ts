import { Component } from '@angular/core';
import { Test1 } from '@geosense-plus/lib-ui';
import { Test2 } from "@geosense-plus/lib-ui"; 

@Component({
  selector: 'app-dashboard',
  imports: [ Test1, Test2 ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
