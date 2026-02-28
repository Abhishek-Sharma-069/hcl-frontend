import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';
import { roleGuard } from '../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./courses/admin-courses.component').then((m) => m.AdminCoursesComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./users/admin-users.component').then((m) => m.AdminUsersComponent),
      },
    ],
  },
];
