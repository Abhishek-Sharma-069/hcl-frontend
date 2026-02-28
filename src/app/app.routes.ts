import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'student',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['student', 'instructor', 'admin'] },
    loadChildren: () =>
      import('./student/student.routes').then((m) => m.STUDENT_ROUTES),
  },
  {
    path: 'instructor',
    loadChildren: () =>
      import('./instructor/instructor.routes').then((m) => m.INSTRUCTOR_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
