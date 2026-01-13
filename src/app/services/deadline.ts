// src/app/services/deadline.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Deadline {
  private http = inject(HttpClient);

  getSecondsToDeadline(): Observable<number> {
    return this.http.get<{ targetDate: string }>(`${environment.apiUrl}/deadline`).pipe(
      map(res => {
        const target = new Date(res.targetDate).getTime();
        const now = Date.now();
        // Return difference in seconds (ensuring it's not negative)
        return Math.max(0, Math.floor((target - now) / 1000));
      })
    );
  }
}
