import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'country/:code',
    loadComponent: () =>
      import('./pages/country/country.component').then(c => c.CountryComponent),
  },
];
