import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateDirectory } from './state-directory';

describe('StateDirectory', () => {
  let component: StateDirectory;
  let fixture: ComponentFixture<StateDirectory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateDirectory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateDirectory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
