import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { loginRedirectGuard } from './core/login-redirect.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then((m) => m.LoginComponent),
    canActivate: [loginRedirectGuard],
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
