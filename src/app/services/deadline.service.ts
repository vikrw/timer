import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { map, Observable, retry, shareReplay } from 'rxjs';

export interface DeadlineResponse {
  targetDate: string;
}
@Injectable({ providedIn: 'root' })
export class DeadlineService {
  private http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/deadline`;

  getSecondsToDeadline(): Observable<number> {
    return this.http.get<DeadlineResponse>(this.endpoint)
    .pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
      retry(1),
      map(res => {
        const target = new Date(res.targetDate).getTime();
  
        if (isNaN(target)) return 0;
        const now = Date.now();
        return Math.max(0, Math.floor((target - now) / 1000));
      })
    );
  }
}