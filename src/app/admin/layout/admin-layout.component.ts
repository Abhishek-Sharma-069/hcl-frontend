import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="min-h-screen bg-stone-50">
      <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <a routerLink="/admin/dashboard" class="flex items-center gap-2 text-stone-800 hover:text-amber-600 transition-colors">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="font-display font-semibold text-lg">LearnHub Admin</span>
            </a>
            <nav class="hidden md:flex items-center gap-1">
              <a routerLink="/admin/dashboard" routerLinkActive="bg-amber-50 text-amber-700" [routerLinkActiveOptions]="{ exact: true }" class="px-4 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors">Dashboard</a>
              <a routerLink="/admin/courses" routerLinkActive="bg-amber-50 text-amber-700" class="px-4 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors">Courses</a>
              <a routerLink="/admin/users" routerLinkActive="bg-amber-50 text-amber-700" class="px-4 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors">Users</a>
            </nav>
            <div class="flex items-center gap-4">
              <a routerLink="/student/catalog" class="text-sm text-stone-500 hover:text-stone-700">View catalog</a>
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
export class AdminLayoutComponent {
  auth = inject(AuthService);
}
