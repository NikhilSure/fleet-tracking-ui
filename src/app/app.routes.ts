import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'live-map',
        pathMatch: 'full'
    },
    {
        path: 'live-map',
        loadComponent: () => import('./layouts/live-map-page/live-map-page').then(m => m.LiveMapPage)
    }
];
