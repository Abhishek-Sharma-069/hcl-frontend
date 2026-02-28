import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-stone-50 to-teal-50 px-4">
      <div class="w-full max-w-md">
        <a routerLink="/auth/login" class="inline-flex items-center gap-2 text-stone-600 hover:text-indigo-600 mb-8 transition-colors">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span class="font-display font-semibold text-lg">LearnHub</span>
        </a>

        <div class="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 p-8">
          <h1 class="text-2xl font-display font-bold text-stone-900 mb-1">Welcome back</h1>
          <p class="text-stone-500 mb-6">Sign in to continue your learning journey</p>

          <form (ngSubmit)="onSubmit()" class="space-y-5">
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
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
              <button
                type="button"
                (click)="showPassword.set(!showPassword())"
                class="mt-1.5 text-sm text-indigo-600 hover:text-indigo-700"
              >
                {{ showPassword() ? 'Hide' : 'Show' }} password
              </button>
            </div>
            <a routerLink="/auth/forgot-password" class="block text-sm text-indigo-600 hover:text-indigo-700">
              Forgot password?
            </a>
            @if (error()) {
              <p class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{{ error() }}</p>
            }
            <button
              type="submit"
              [disabled]="loading()"
              class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl transition-colors"
            >
              {{ loading() ? 'Signing in...' : 'Sign in' }}
            </button>
          </form>

          <p class="mt-6 text-center text-stone-500 text-sm">
            Don't have an account?
            <a routerLink="/auth/register" class="text-indigo-600 hover:text-indigo-700 font-medium">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  showPassword = signal(false);
  loading = signal(false);
  error = signal('');

  onSubmit() {
    this.loading.set(true);
    this.error.set('');
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.redirectByRole(),
      error: (err) => {
        this.error.set(err?.error?.message ?? err?.message ?? 'Login failed');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  private redirectByRole(): void {
    const user = this.auth.getUser();
    const role = (user?.role ?? '').toLowerCase();
    if (role === 'admin') this.router.navigate(['/admin/dashboard']);
    else if (role === 'instructor') this.router.navigate(['/instructor/dashboard']);
    else this.router.navigate(['/student/dashboard']);
  }
}
