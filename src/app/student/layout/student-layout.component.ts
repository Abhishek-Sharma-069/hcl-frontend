import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="min-h-screen bg-stone-50">
      <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <a routerLink="/student/dashboard" class="flex items-center gap-2 text-stone-800 hover:text-indigo-600 transition-colors">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span class="font-display font-semibold text-lg">LearnHub</span>
            </a>

            <nav class="hidden md:flex items-center gap-1">
              <a
                routerLink="/student/dashboard"
                routerLinkActive="bg-indigo-50 text-indigo-700"
                [routerLinkActiveOptions]="{ exact: true }"
                class="px-4 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                Dashboard
              </a>
              <a
                routerLink="/student/catalog"
                routerLinkActive="bg-indigo-50 text-indigo-700"
                class="px-4 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                Catalog
              </a>
              <a
                routerLink="/student/progress"
                routerLinkActive="bg-indigo-50 text-indigo-700"
                class="px-4 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                Progress
              </a>
              <a
                routerLink="/student/profile"
                routerLinkActive="bg-indigo-50 text-indigo-700"
                class="px-4 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                Profile
              </a>
            </nav>

            <div class="flex items-center gap-4">
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
export class StudentLayoutComponent {
  auth = inject(AuthService);
}
