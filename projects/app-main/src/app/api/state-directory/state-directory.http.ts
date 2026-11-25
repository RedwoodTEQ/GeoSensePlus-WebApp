import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap, throwError } from 'rxjs';

import { AddGroupRequest, PointGroupsService } from '../openapi/generated';
import { DirectoryGroup } from './directory.models';

/**
 * Façade over the generated OpenAPI `PointGroupsService`.
 *
 * Mocking vs. the real server is decided at the network level: the
 * `useMocks` flag in `environments/environment.ts` starts the MSW worker
 * (see `main.ts`), which intercepts these same URLs. With mocking off the
 * requests fall through the dev-server proxy to the .NET backend — this
 * service never branches on the flag.
 */
@Injectable({
  providedIn: 'root'
})
export class StateDirectoryHttpService {
  private readonly pointGroupsApi = inject(PointGroupsService);

  // Signals for reactive state management
  private readonly _subtree = signal<DirectoryGroup[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  // Public computed signals
  readonly subtree = this._subtree.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hasError = computed(() => this._error() !== null);

  /**
   * Get the subtree rooted at a group.
   * GET /api/point-groups/{id}/subtree
   *
   * The UNS tree has a single root group (id 1); the server returns `[]`
   * when the id is unknown.
   */
  getSubtree(id: number): Observable<DirectoryGroup[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.pointGroupsApi.apiPointGroupsIdSubtreeGet({ id }).pipe(
      tap(subtree => {
        this._subtree.set(subtree ?? []);
        this._loading.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error, 'Failed to load directory subtree');
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a child group under `parentId`; the server responds with the
   * created group (including its server-assigned id).
   * POST /api/point-groups
   */
  addGroup(request: AddGroupRequest): Observable<DirectoryGroup> {
    this._loading.set(true);
    this._error.set(null);

    return this.pointGroupsApi.apiPointGroupsPost({ addGroupRequest: request }).pipe(
      tap(() => {
        this._loading.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error, 'Failed to add group');
        return throwError(() => error);
      })
    );
  }

  /**
   * Clear current state (used for error recovery)
   */
  clearState() {
    this._subtree.set([]);
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
