import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';
import { roleGuard } from '../core/guards/role.guard';

export const INSTRUCTOR_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['instructor', 'admin'] },
    loadComponent: () =>
      import('./layout/instructor-layout.component').then((m) => m.InstructorLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/instructor-dashboard.component').then((m) => m.InstructorDashboardComponent),
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./courses/instructor-courses.component').then((m) => m.InstructorCoursesComponent),
      },
      {
        path: 'courses/new',
        loadComponent: () =>
          import('./create-course/create-course.component').then((m) => m.CreateCourseComponent),
      },
      {
        path: 'courses/:id/edit',
        loadComponent: () =>
          import('./edit-course/edit-course.component').then((m) => m.EditCourseComponent),
      },
    ],
  },
];
