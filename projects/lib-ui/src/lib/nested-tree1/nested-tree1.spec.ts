import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedTree1 } from './nested-tree1';

describe('NestedTree1', () => {
  let component: NestedTree1;
  let fixture: ComponentFixture<NestedTree1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NestedTree1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NestedTree1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
