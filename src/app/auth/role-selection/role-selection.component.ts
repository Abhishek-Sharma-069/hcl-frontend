import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-stone-50 to-teal-50 px-4">
      <div class="w-full max-w-lg">
        <a routerLink="/auth/login" class="inline-flex items-center gap-2 text-stone-600 hover:text-indigo-600 mb-8 transition-colors">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span class="font-display font-semibold text-lg">LearnHub</span>
        </a>

        <div class="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 p-8">
          <h1 class="text-2xl font-display font-bold text-stone-900 mb-1">How will you use LearnHub?</h1>
          <p class="text-stone-500 mb-8">Choose your role to get started</p>

          <div class="grid gap-4 sm:grid-cols-3">
            <button
              type="button"
              (click)="selectRole('Student')"
              class="group flex flex-col items-center p-6 rounded-xl border-2 transition-all"
              [class.border-indigo-500]="selectedRole() === 'Student'"
              [class.bg-indigo-50]="selectedRole() === 'Student'"
              [class.border-stone-200]="selectedRole() !== 'Student'"
              [class.hover:border-indigo-300]="selectedRole() !== 'Student'"
            >
              <div class="w-14 h-14 rounded-full bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center mb-4 transition-colors">
                <svg class="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span class="font-display font-semibold text-stone-900">Student</span>
              <span class="text-sm text-stone-500 mt-1 text-center">Browse courses, learn, and track progress</span>
            </button>

            <button
              type="button"
              (click)="selectRole('Instructor')"
              class="group flex flex-col items-center p-6 rounded-xl border-2 transition-all"
              [class.border-teal-500]="selectedRole() === 'Instructor'"
              [class.bg-teal-50]="selectedRole() === 'Instructor'"
              [class.border-stone-200]="selectedRole() !== 'Instructor'"
              [class.hover:border-teal-300]="selectedRole() !== 'Instructor'"
            >
              <div class="w-14 h-14 rounded-full bg-teal-100 group-hover:bg-teal-200 flex items-center justify-center mb-4 transition-colors">
                <svg class="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span class="font-display font-semibold text-stone-900">Instructor</span>
              <span class="text-sm text-stone-500 mt-1 text-center">Create and manage courses</span>
            </button>

            <button
              type="button"
              (click)="selectRole('Admin')"
              class="group flex flex-col items-center p-6 rounded-xl border-2 transition-all"
              [class.border-amber-500]="selectedRole() === 'Admin'"
              [class.bg-amber-50]="selectedRole() === 'Admin'"
              [class.border-stone-200]="selectedRole() !== 'Admin'"
              [class.hover:border-amber-300]="selectedRole() !== 'Admin'"
            >
              <div class="w-14 h-14 rounded-full bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center mb-4 transition-colors">
                <svg class="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span class="font-display font-semibold text-stone-900">Admin</span>
              <span class="text-sm text-stone-500 mt-1 text-center">Manage courses and users</span>
            </button>
          </div>

          <button
            (click)="continue()"
            [disabled]="!selectedRole()"
            class="w-full mt-8 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  `,
})
export class RoleSelectionComponent {
  selectedRole = signal<'Student' | 'Instructor' | 'Admin' | null>(null);

  constructor(private router: Router) {}

  selectRole(role: 'Student' | 'Instructor' | 'Admin') {
    this.selectedRole.set(role);
  }

  continue() {
    const role = this.selectedRole();
    if (role === 'Admin') this.router.navigate(['/admin/dashboard']);
    else if (role === 'Instructor') this.router.navigate(['/instructor/dashboard']);
    else this.router.navigate(['/student/dashboard']);
  }
}
