import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'lib-test1',
  imports: [MatCardModule, MatButtonModule, MatMenuModule, MatIconModule],
  template: `
    <mat-card class="card1">
      <mat-card-header>
        <mat-card-title>
          {{title}}
          <button mat-icon-button class="more-button" [matMenuTriggerFor]="menu" aria-label="Toggle menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu" xPosition="before">
            <button mat-menu-item>Expand</button>
            <button mat-menu-item>Remove</button>
          </mat-menu>
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <ng-content></ng-content>
      </mat-card-content>
    </mat-card>
  `,
  styles: ``
})
export class Test1 {
  @Input() title: string = 'Test1 Card Title';
}
