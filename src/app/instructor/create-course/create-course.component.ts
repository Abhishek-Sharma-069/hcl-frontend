import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-2xl space-y-6">
      <div>
        <h1 class="text-3xl font-display font-bold text-stone-900">Create course</h1>
        <p class="mt-1 text-stone-500">Add title and description. You can add lessons and quizzes after saving.</p>
      </div>
      <form (ngSubmit)="onSubmit()" class="space-y-5">
        <div>
          <label for="title" class="block text-sm font-medium text-stone-700 mb-1.5">Title</label>
          <input
            id="title"
            type="text"
            [(ngModel)]="title"
            name="title"
            required
            placeholder="e.g. C# Basics"
            class="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
          />
        </div>
        <div>
          <label for="description" class="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
          <textarea
            id="description"
            [(ngModel)]="description"
            name="description"
            required
            rows="4"
            placeholder="What will students learn?"
            class="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
          ></textarea>
        </div>
        @if (error()) {
          <p class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{{ error() }}</p>
        }
        <div class="flex gap-3">
          <button type="submit" [disabled]="loading()" class="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium rounded-xl transition-colors">
            {{ loading() ? 'Creating...' : 'Create course' }}
          </button>
          <button type="button" (click)="cancel()" class="px-6 py-3 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-xl">Cancel</button>
        </div>
      </form>
    </div>
  `,
})
export class CreateCourseComponent {
  private courseService = inject(CourseService);
  private auth = inject(AuthService);
  private router = inject(Router);

  title = '';
  description = '';
  loading = signal(false);
  error = signal('');

  onSubmit() {
    this.loading.set(true);
    this.error.set('');
    const instructorId = this.auth.getUser()?.id;
    this.courseService.create({ title: this.title, description: this.description, instructorId }).subscribe({
      next: () => this.router.navigate(['/instructor/courses']),
      error: (err) => {
        this.error.set(err?.error?.message ?? err?.message ?? 'Failed to create course');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  cancel() {
    this.router.navigate(['/instructor/courses']);
  }
}
