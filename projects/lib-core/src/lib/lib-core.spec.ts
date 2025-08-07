import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibCore } from './lib-core';

describe('LibCore', () => {
  let component: LibCore;
  let fixture: ComponentFixture<LibCore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibCore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibCore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
