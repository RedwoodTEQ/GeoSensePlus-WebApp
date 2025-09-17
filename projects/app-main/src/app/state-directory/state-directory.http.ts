import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { signal, computed } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';

export interface PointData {
  id: number;
  name: string;
}

export interface GroupData {
  id: number;
  name: string;
  children?: GroupData[];
  points?: PointData[];
  isExpanded: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StateDirectoryHttpService {
  private http = inject(HttpClient);

  // API base URL - will be configured via proxy
  private readonly apiUrl = '/api/directory';

  // Signals for reactive state management
  private readonly _views = signal<GroupData[]>([]);
  private readonly _currentTree = signal<GroupData | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  // Public computed signals
  readonly views = this._views.asReadonly();
  readonly currentTree = this._currentTree.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hasError = computed(() => this._error() !== null);

  constructor() {
    console.log('StateDirectoryHttpService initialized');
  }

  /**
   * Get all available views (root nodes)
   * GET /api/directory/views/
   */
  getViews() {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<GroupData[]>(`${this.apiUrl}/views/`).pipe(
      tap(views => {
        this._views.set(views);
        this._loading.set(false);
        console.log('Views loaded:', views);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error, 'Failed to load views');
        return throwError(() => error);
      })
    );
  }

  /**
   * Get complete tree data for a specific view
   * GET /api/directory/views/{id}
   */
  getTreeView(id: number) {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<GroupData>(`${this.apiUrl}/views/${id}`).pipe(
      tap(treeData => {
        this._currentTree.set(treeData);
        this._loading.set(false);
        console.log('Tree data loaded:', treeData);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error, 'Failed to load tree data');
        return throwError(() => error);
      })
    );
  }

  /**
   * Update point details
   * PUT /api/directory/points/{id}
   */
  updatePoint(id: number, pointData: Partial<PointData>) {
    this._loading.set(true);
    this._error.set(null);

    return this.http.put<void>(`${this.apiUrl}/points/${id}`, pointData).pipe(
      tap(() => {
        this._loading.set(false);
        console.log('Point updated:', id, pointData);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error, 'Failed to update point');
        return throwError(() => error);
      })
    );
  }

  /**
   * Create new point
   * POST /api/directory/points
   */
  createPoint(pointData: Omit<PointData, 'id'>) {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<PointData>(`${this.apiUrl}/points`, pointData).pipe(
      tap(createdPoint => {
        this._loading.set(false);
        console.log('Point created:', createdPoint);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error, 'Failed to create point');
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete point
   * DELETE /api/directory/points/{id}
   */
  deletePoint(id: number) {
    this._loading.set(true);
    this._error.set(null);

    return this.http.delete<void>(`${this.apiUrl}/points/${id}`).pipe(
      tap(() => {
        this._loading.set(false);
        console.log('Point deleted:', id);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error, 'Failed to delete point');
        return throwError(() => error);
      })
    );
  }

  /**
   * Update group details
   * PUT /api/directory/groups/{id}
   */
  updateGroup(id: number, groupData: Partial<GroupData>) {
    this._loading.set(true);
    this._error.set(null);

    return this.http.put<void>(`${this.apiUrl}/groups/${id}`, groupData).pipe(
      tap(() => {
        this._loading.set(false);
        console.log('Group updated:', id, groupData);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error, 'Failed to update group');
        return throwError(() => error);
      })
    );
  }

  /**
   * Create child group
   * POST /api/directory/groups
   */
  createGroup(groupData: Omit<GroupData, 'id'>) {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<GroupData>(`${this.apiUrl}/groups`, groupData).pipe(
      tap(createdGroup => {
        this._loading.set(false);
        console.log('Group created:', createdGroup);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error, 'Failed to create group');
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete group
   * DELETE /api/directory/groups/{id}
   */
  deleteGroup(id: number) {
    this._loading.set(true);
    this._error.set(null);

    return this.http.delete<void>(`${this.apiUrl}/groups/${id}`).pipe(
      tap(() => {
        this._loading.set(false);
        console.log('Group deleted:', id);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error, 'Failed to delete group');
        return throwError(() => error);
      })
    );
  }

  /**
   * Clear current state (used for error recovery)
   */
  clearState() {
    this._currentTree.set(null);
    this._error.set(null);
    this._loading.set(false);
  }

  /**
   * Clear error state
   */
  clearError() {
    this._error.set(null);
  }

  /**
   * Centralized error handling
   */
  private handleError(error: HttpErrorResponse, message: string) {
    this._loading.set(false);

    let errorMessage = message;

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `${message}: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `${message}: ${error.message}`;

      if (error.status === 0) {
        errorMessage = 'Network error: Unable to connect to the server';
      } else if (error.status >= 400 && error.status < 500) {
        errorMessage = `Client error: ${error.error?.message || error.message}`;
      } else if (error.status >= 500) {
        errorMessage = `Server error: ${error.error?.message || error.message}`;
      }
    }

    this._error.set(errorMessage);
    console.error('HTTP Error:', errorMessage, error);
  }
}