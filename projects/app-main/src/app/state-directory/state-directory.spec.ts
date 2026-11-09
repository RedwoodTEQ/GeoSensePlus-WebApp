import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { StateDirectory } from './state-directory';

describe('StateDirectory', () => {
  let component: StateDirectory;
  let fixture: ComponentFixture<StateDirectory>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateDirectory],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateDirectory);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    // detectChanges() triggers ngAfterViewInit -> setNewData() -> loadData()
    // -> StateDirectoryHttpService.getViews() -> GET /api/directory/views/
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    const req = httpMock.expectOne('/api/directory/views/');
    req.flush([]); // empty views -> empty tree
    expect(component).toBeTruthy();
  });
});
