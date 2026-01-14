import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, NgZone, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DeadlineService } from '../services/deadline.service';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Timer implements OnInit {
  private service = inject(DeadlineService);
  private destroyRef = inject(DestroyRef);
  private ngZone = inject(NgZone);
  secondsLeft = signal<number>(-1);

  formattedTime = computed(() => {
    const s = this.secondsLeft();
    if (s <= 0) return '00:00:00';
    
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    
    return `${h}:${m}:${sec}`;
  });

  ngOnInit() {
    this.service.getSecondsToDeadline()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(initialSeconds => {
        const target = Date.now() + (initialSeconds * 1000);
        this.secondsLeft.set(initialSeconds);

        this.ngZone.runOutsideAngular(() => {
          const intervalId = setInterval(() => {
            const remaining = Math.max(0, Math.floor((target - Date.now()) / 1000));
      
            if (remaining !== this.secondsLeft()) {
              this.secondsLeft.set(remaining);
            }

            if (remaining === 0) clearInterval(intervalId);
          }, 1000);

          this.destroyRef.onDestroy(() => clearInterval(intervalId));
        });
      });
  }
}
