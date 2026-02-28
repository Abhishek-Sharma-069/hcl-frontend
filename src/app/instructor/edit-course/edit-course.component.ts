import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService, type CourseDetail } from '../../core/services/course.service';

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="max-w-2xl space-y-6">
      <div>
        <h1 class="text-3xl font-display font-bold text-stone-900">Edit course</h1>
        <p class="mt-1 text-stone-500">Update title and description. Lessons and quizzes can be managed here when the API supports it.</p>
      </div>
      @if (loading()) {
        <p class="text-stone-500">Loading...</p>
      } @else if (course()) {
        <form (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label for="title" class="block text-sm font-medium text-stone-700 mb-1.5">Title</label>
            <input id="title" type="text" [(ngModel)]="title" name="title" required class="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none" />
          </div>
          <div>
            <label for="description" class="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
            <textarea id="description" [(ngModel)]="description" name="description" required rows="4" class="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"></textarea>
          </div>
          @if (course()?.lessons?.length) {
            <div>
              <h3 class="font-medium text-stone-700 mb-2">Lessons ({{ course()!.lessons!.length }})</h3>
              <ul class="list-disc list-inside text-stone-500 text-sm">@for (l of course()!.lessons; track l.id) { <li>{{ l.title }}</li> }</ul>
            </div>
          }
          @if (course()?.quizzes?.length) {
            <div>
              <h3 class="font-medium text-stone-700 mb-2">Quizzes ({{ course()!.quizzes!.length }})</h3>
              <ul class="list-disc list-inside text-stone-500 text-sm">@for (q of course()!.quizzes; track q.id) { <li>{{ q.title }}</li> }</ul>
            </div>
          }
          @if (error()) {
            <p class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{{ error() }}</p>
          }
          <div class="flex gap-3">
            <button type="submit" [disabled]="saving()" class="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium rounded-xl"> {{ saving() ? 'Saving...' : 'Save' }} </button>
            <a routerLink="/instructor/courses" class="px-6 py-3 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-xl inline-block">Cancel</a>
          </div>
        </form>
      }
    </div>
  `,
})
export class EditCourseComponent implements OnInit {
  private courseService = inject(CourseService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  course = signal<CourseDetail | null>(null);
  title = '';
  description = '';
  loading = signal(true);
  saving = signal(false);
  error = signal('');

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/instructor/courses']);
      return;
    }
    this.courseService.getById(id).subscribe({
      next: (c) => {
        this.course.set(c);
        this.title = c.title;
        this.description = c.description;
      },
      error: () => this.router.navigate(['/instructor/courses']),
      complete: () => this.loading.set(false),
    });
  }

  onSubmit() {
    const c = this.course();
    if (!c) return;
    this.saving.set(true);
    this.error.set('');
    this.courseService.update(c.id, { title: this.title, description: this.description }).subscribe({
      next: () => this.router.navigate(['/instructor/courses']),
      error: (err) => {
        this.error.set(err?.error?.message ?? err?.message ?? 'Failed to update');
        this.saving.set(false);
      },
      complete: () => this.saving.set(false),
    });
  }
}
