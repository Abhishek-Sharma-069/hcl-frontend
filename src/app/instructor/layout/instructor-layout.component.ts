import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-instructor-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="min-h-screen bg-stone-50">
      <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <a routerLink="/instructor/dashboard" class="flex items-center gap-2 text-stone-800 hover:text-teal-600 transition-colors">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="font-display font-semibold text-lg">LearnHub Instructor</span>
            </a>
            <nav class="hidden md:flex items-center gap-1">
              <a routerLink="/instructor/dashboard" routerLinkActive="bg-teal-50 text-teal-700" [routerLinkActiveOptions]="{ exact: true }" class="px-4 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors">Dashboard</a>
              <a routerLink="/instructor/courses" routerLinkActive="bg-teal-50 text-teal-700" class="px-4 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors">My Courses</a>
              <a routerLink="/instructor/courses/new" routerLinkActive="bg-teal-50 text-teal-700" class="px-4 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors">Create Course</a>
            </nav>
            <div class="flex items-center gap-4">
              <a routerLink="/student/catalog" class="text-sm text-stone-500 hover:text-stone-700">View as student</a>
              <button type="button" (click)="auth.logout()" class="text-sm text-stone-500 hover:text-stone-700">Sign out</button>
            </div>
          </div>
        </div>
      </header>
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <router-outlet />
      </main>
    </div>
  `,
})
export class InstructorLayoutComponent {
  auth = inject(AuthService);
}
