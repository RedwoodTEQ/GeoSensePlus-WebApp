import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nav1 } from './nav1';

describe('Nav1', () => {
  let component: Nav1;
  let fixture: ComponentFixture<Nav1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nav1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Nav1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
