import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-stone-50 to-teal-50 px-4 py-12">
      <div class="w-full max-w-md">
        <a routerLink="/auth/login" class="inline-flex items-center gap-2 text-stone-600 hover:text-indigo-600 mb-8 transition-colors">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span class="font-display font-semibold text-lg">LearnHub</span>
        </a>

        <div class="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 p-8">
          <h1 class="text-2xl font-display font-bold text-stone-900 mb-1">Create an account</h1>
          <p class="text-stone-500 mb-6">Start your learning journey today</p>

          <form (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label for="fullName" class="block text-sm font-medium text-stone-700 mb-1.5">Full name</label>
              <input
                id="fullName"
                type="text"
                [(ngModel)]="fullName"
                name="fullName"
                required
                placeholder="John Doe"
                class="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                placeholder="you@example.com"
                class="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
              <input
                id="password"
                [type]="showPassword() ? 'text' : 'password'"
                [(ngModel)]="password"
                name="password"
                required
                minlength="6"
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
              <p class="mt-1 text-xs text-stone-500">At least 6 characters</p>
            </div>
            <div>
              <label for="role" class="block text-sm font-medium text-stone-700 mb-1.5">I am a</label>
              <select
                id="role"
                [(ngModel)]="role"
                name="role"
                required
                class="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              >
                <option value="student">Student – Browse courses, enroll, take quizzes</option>
                <option value="instructor">Instructor – Create and manage courses, lessons, quizzes</option>
                <option value="admin">Admin – Manage courses, students, and instructors</option>
              </select>
            </div>
            @if (error()) {
              <p class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{{ error() }}</p>
            }
            <button
              type="submit"
              [disabled]="loading()"
              class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl transition-colors"
            >
              {{ loading() ? 'Creating account...' : 'Create account' }}
            </button>
          </form>

          <p class="mt-6 text-center text-stone-500 text-sm">
            Already have an account?
            <a routerLink="/auth/login" class="text-indigo-600 hover:text-indigo-700 font-medium">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  fullName = '';
  email = '';
  password = '';
  role: 'student' | 'instructor' | 'admin' = 'student';
  showPassword = signal(false);
  loading = signal(false);
  error = signal('');

  onSubmit() {
    this.loading.set(true);
    this.error.set('');
    this.auth.register({ name: this.fullName, email: this.email, password: this.password, role: this.role }).subscribe({
      next: () => this.redirectByRole(this.role),
      error: (err) => {
        this.error.set(err?.error?.message ?? err?.message ?? 'Registration failed');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  private redirectByRole(role: string): void {
    const r = (role || '').toLowerCase();
    if (r === 'admin') this.router.navigate(['/admin/dashboard']);
    else if (r === 'instructor') this.router.navigate(['/instructor/dashboard']);
    else this.router.navigate(['/student/dashboard']);
  }
}
