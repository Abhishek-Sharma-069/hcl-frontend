import { Routes } from '@angular/router';

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
    loadChildren: () =>
      import('./student/student.routes').then((m) => m.STUDENT_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
