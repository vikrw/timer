import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Deadline } from '../services/deadline';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Timer implements OnInit {
  private service = inject(Deadline);
  private destroyRef = inject(DestroyRef);
  secondsLeft = signal<number | null>(null);

  ngOnInit() {
  this.service.getSecondsToDeadline()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(initialSeconds => {
      // 1. Record the EXACT moment we got the data
      const startTime = Date.now();
      this.secondsLeft.set(initialSeconds);

      const intervalId = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const newValue = initialSeconds - elapsedSeconds;

        // 2. This is the ultimate accuracy logic
        this.secondsLeft.set(newValue > 0 ? newValue : 0);

        if (newValue <= 0) clearInterval(intervalId);
      }, 1000);

      this.destroyRef.onDestroy(() => clearInterval(intervalId));
    });
  }
}
