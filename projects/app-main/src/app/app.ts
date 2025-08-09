import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav1 } from "@geosense-plus/lib-ui";

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, Nav1 ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('app-main');
}
