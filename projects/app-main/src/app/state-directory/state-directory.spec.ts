import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { StateDirectory } from './state-directory';
import { StateDirectoryService } from './state-directory.service';
import { provideApi } from '../api/openapi/generated';

/** .NET's default DateTime, as serialized by the real server. */
const EPOCH = '0001-01-01T00:00:00+00:00';

describe('StateDirectory', () => {
  let component: StateDirectory;
  let fixture: ComponentFixture<StateDirectory>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateDirectory],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideApi('')],
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateDirectory);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    // detectChanges() triggers ngAfterViewInit -> setNewData() -> loadData()
    // -> StateDirectoryHttpService.getSubtree(1)
    // -> GET /api/point-groups/1/subtree
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    const req = httpMock.expectOne('/api/point-groups/1/subtree');
    req.flush([]); // empty subtree -> empty tree
    expect(component).toBeTruthy();
  });

  it('maps the subtree payload to tree nodes (data points become leaves)', async () => {
    const req = httpMock.expectOne('/api/point-groups/1/subtree');
    req.flush([
      {
        id: 1,
        name: 'Root',
        parentId: null,
        description: null,
        children: [
          {
            id: 2,
            name: 'Child',
            parentId: 1,
            description: null,
            children: [],
            dataPoints: [
              {
                id: 10,
                name: 'TestPoint',
                parentId: 2,
                description: null,
                dataChannels: [],
                scalarValue: null,
                createdAt: EPOCH,
                updatedAt: EPOCH,
                isDeleted: false,
              },
            ],
            createdAt: EPOCH,
            updatedAt: EPOCH,
            isDeleted: false,
          },
        ],
        dataPoints: [],
        createdAt: EPOCH,
        updatedAt: EPOCH,
        isDeleted: false,
      },
    ]);
    await fixture.whenStable();

    const tree = TestBed.inject(StateDirectoryService).getTreeData();
    expect(tree.length).toBe(1);
    expect(tree[0].id).toBe(1);
    expect(tree[0].name).toBe('Root');
    // sub-groups come first, then the group's own data points as leaf nodes
    expect(tree[0].children?.map((n) => n.name)).toEqual(['Child']);
    expect(tree[0].children?.[0].id).toBe(2);
    expect(tree[0].children?.[0].children?.map((n) => n.name)).toEqual(['TestPoint']);
    expect(tree[0].children?.[0].children?.[0].children).toBeUndefined();
  });
});
