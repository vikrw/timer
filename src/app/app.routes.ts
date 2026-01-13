import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'timer',
        loadComponent: () => import('./timer/timer').then(m => m.Timer)
    }
];
