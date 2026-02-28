import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/student-layout.component').then(
        (m) => m.StudentLayoutComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'catalog',
        loadComponent: () =>
          import('./catalog/catalog.component').then((m) => m.CatalogComponent),
      },
      {
        path: 'course/:id',
        loadComponent: () =>
          import('./course-details/course-details.component').then(
            (m) => m.CourseDetailsComponent
          ),
      },
      {
        path: 'course/:courseId/lesson/:lessonId',
        loadComponent: () =>
          import('./course-player/course-player.component').then(
            (m) => m.CoursePlayerComponent
          ),
      },
      {
        path: 'course/:courseId/quiz/:quizId',
        loadComponent: () =>
          import('./quiz/quiz.component').then((m) => m.QuizComponent),
      },
      {
        path: 'progress',
        loadComponent: () =>
          import('./progress/progress.component').then(
            (m) => m.ProgressComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile.component').then((m) => m.ProfileComponent),
      },
    ],
  },
];
