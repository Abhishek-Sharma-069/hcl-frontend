import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
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
          <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 class="text-2xl font-display font-bold text-stone-900 mb-1">Reset password</h1>
          <p class="text-stone-500 mb-6">Enter your email and we'll send you a reset link</p>

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
            @if (success()) {
              <p class="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">Check your email for the reset link.</p>
            }
            @if (error()) {
              <p class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{{ error() }}</p>
            }
            <button
              type="submit"
              [disabled]="loading()"
              class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl transition-colors"
            >
              {{ loading() ? 'Sending...' : 'Send reset link' }}
            </button>
          </form>

          <a routerLink="/auth/login" class="mt-6 flex items-center justify-center gap-2 text-stone-500 hover:text-indigo-600 text-sm transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to sign in
          </a>
        </div>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  email = '';
  loading = signal(false);
  success = signal(false);
  error = signal('');

  onSubmit() {
    this.loading.set(true);
    this.success.set(false);
    this.error.set('');
    // TODO: Call forgot password API
    setTimeout(() => {
      this.loading.set(false);
      this.success.set(true);
    }, 1000);
  }
}
