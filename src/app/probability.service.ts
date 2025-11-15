import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay, switchMap, tap } from 'rxjs/operators';

export interface ProbabilityRequest {
  pA: number;
  pB: number;
  operation: 'CombinedWith' | 'Either';
}

export interface ProbabilityResponse {
  result: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProbabilityService {
  // Use a relative path by default. If `api-config.json` defines `apiBase`, it will be
  // prefixed to the API path so requests go directly to that backend.
  private readonly apiPath = '/api/Calculator/calculate';
  private readonly configUrl = '/assets/api-config.json';

  // Cached observable of the apiBase string; empty string if none configured.
  private apiBase$!: Observable<string>;

  constructor(private http: HttpClient) {
    this.apiBase$ = this.http.get<{ apiBase?: string }>(this.configUrl).pipe(
      // If config defines apiBase use it; otherwise default to the explicit backend host
      map(cfg => cfg && cfg.apiBase ? cfg.apiBase : 'https://localhost:7039'),
      catchError(() => of('https://localhost:7039')),
      shareReplay(1)
    );
  }

  calculate(request: ProbabilityRequest): Observable<ProbabilityResponse> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    // Use configured apiBase if provided, otherwise use relative path (which will be
    // proxied by `ng serve --proxy-config` during development).
    return this.apiBase$.pipe(
      tap(base => console.debug('[ProbabilityService] apiBase resolved:', base)),
      switchMap(base => {
        const url = (base ? base.replace(/\/$/, '') : '') + this.apiPath;
        console.debug('[ProbabilityService] POST url:', url, 'payload:', request);
        return this.http.post<ProbabilityResponse>(url, request, { headers });
      })
    );
  }
}