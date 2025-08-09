import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Test1 } from '@geosense-plus/lib-ui';
import { Test2 } from "@geosense-plus/lib-ui"; 
import { Nav1 } from "@geosense-plus/lib-ui";

@Component({
  selector: 'app-root',
  imports:  [ RouterOutlet
            , Test1
            , Test2
            , Nav1 ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('app-main');
}
