import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibUi } from './lib-ui';

describe('LibUi', () => {
  let component: LibUi;
  let fixture: ComponentFixture<LibUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
