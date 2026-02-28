import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService, type CourseDetail } from '../../core/services/course.service';
import { QuizService } from '../../core/services/quiz.service';

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="space-y-6">
      <a routerLink="/instructor/courses" class="inline-flex items-center gap-2 text-stone-500 hover:text-teal-600 text-sm font-medium">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to My Courses
      </a>

      @if (loading()) {
        <div class="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500">Loading course...</div>
      } @else if (loadError()) {
        <div class="bg-white rounded-xl border border-stone-200 p-6">
          <p class="text-red-600">{{ loadError() }}</p>
          <a routerLink="/instructor/courses" class="mt-4 inline-block text-teal-600 font-medium">Back to courses</a>
        </div>
      } @else if (course()) {
        <!-- Course details card -->
        <div class="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-stone-100 bg-stone-50/50">
            <h1 class="text-xl font-display font-bold text-stone-900">Edit course</h1>
            <p class="text-sm text-stone-500 mt-0.5">Update title and description</p>
          </div>
          <form (ngSubmit)="onSubmit()" class="p-6 space-y-5">
            <div>
              <label for="title" class="block text-sm font-medium text-stone-700 mb-1.5">Title</label>
              <input id="title" type="text" [(ngModel)]="title" name="title" required class="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none" />
            </div>
            <div>
              <label for="description" class="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
              <textarea id="description" [(ngModel)]="description" name="description" required rows="4" class="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"></textarea>
            </div>
            @if (error()) {
              <p class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{{ error() }}</p>
            }
            <div class="flex gap-3">
              <button type="submit" [disabled]="saving()" class="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium rounded-xl">
                {{ saving() ? 'Saving...' : 'Save course' }}
              </button>
              <a routerLink="/instructor/courses" class="px-6 py-3 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-xl inline-block">Cancel</a>
            </div>
          </form>
        </div>

        <!-- Lessons card (always visible) -->
        <div class="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-stone-100 bg-stone-50/50">
            <h2 class="text-lg font-display font-semibold text-stone-900">Lessons</h2>
            <p class="text-sm text-stone-500 mt-0.5">{{ (course()!.lessons ?? []).length }} lesson(s)</p>
          </div>
          <div class="p-6">
            @if ((course()!.lessons ?? []).length > 0) {
              <ul class="list-disc list-inside text-stone-600 space-y-1">
                @for (l of course()!.lessons; track l.id) {
                  <li>{{ l.title }}</li>
                }
              </ul>
            } @else {
              <p class="text-stone-500 text-sm">No lessons yet. Add lessons when the API supports it.</p>
            }
          </div>
        </div>

        <!-- Quizzes card (always visible) with Add quiz -->
        <div class="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-stone-100 bg-stone-50/50">
            <h2 class="text-lg font-display font-semibold text-stone-900">Quizzes</h2>
            <p class="text-sm text-stone-500 mt-0.5">{{ (course()!.quizzes ?? []).length }} quiz(zes)</p>
          </div>
          <div class="p-6 space-y-6">
            @if ((course()!.quizzes ?? []).length > 0) {
              <ul class="list-disc list-inside text-stone-600 space-y-1">
                @for (q of course()!.quizzes; track q.id) {
                  <li>{{ q.title }}</li>
                }
              </ul>
            } @else {
              <p class="text-stone-500 text-sm">No quizzes yet. Add one below.</p>
            }

            <div class="pt-4 border-t border-stone-100">
              <h3 class="font-medium text-stone-700 mb-3">Add quiz</h3>
              <form (ngSubmit)="onAddQuiz()" class="flex flex-wrap items-end gap-3">
                <div class="min-w-[200px] flex-1">
                  <label for="newQuizTitle" class="block text-sm font-medium text-stone-600 mb-1">Quiz title</label>
                  <input
                    id="newQuizTitle"
                    type="text"
                    [(ngModel)]="newQuizTitle"
                    name="newQuizTitle"
                    placeholder="e.g. Module 1 Quiz"
                    class="w-full px-4 py-2 rounded-lg border border-stone-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                  />
                </div>
                <button type="submit" [disabled]="addingQuiz()" class="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium rounded-lg text-sm">
                  {{ addingQuiz() ? 'Adding...' : 'Add quiz' }}
                </button>
              </form>
              @if (quizError()) {
                <p class="mt-2 text-sm text-red-600">{{ quizError() }}</p>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class EditCourseComponent implements OnInit {
  private courseService = inject(CourseService);
  private quizService = inject(QuizService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  course = signal<CourseDetail | null>(null);
  title = '';
  description = '';
  loading = signal(true);
  saving = signal(false);
  error = signal('');
  loadError = signal('');
  newQuizTitle = '';
  addingQuiz = signal(false);
  quizError = signal('');

  private getCourseId(): number {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    return id && !Number.isNaN(id) ? id : 0;
  }

  ngOnInit() {
    const id = this.getCourseId();
    if (!id) {
      this.loadError.set('Invalid course ID');
      this.loading.set(false);
      return;
    }
    this.loadCourse(id);
  }

  private loadCourse(id: number): void {
    this.loading.set(true);
    this.loadError.set('');
    this.courseService.getById(id).subscribe({
      next: (c) => {
        this.course.set(c);
        this.title = c.title;
        this.description = c.description;
      },
      error: (err) => {
        this.loadError.set(err?.error?.message ?? err?.message ?? 'Failed to load course');
      },
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

  onAddQuiz() {
    const c = this.course();
    const title = this.newQuizTitle?.trim();
    if (!c || !title) {
      this.quizError.set('Enter a quiz title');
      return;
    }
    this.addingQuiz.set(true);
    this.quizError.set('');
    this.quizService.create(c.id, { title }).subscribe({
      next: () => {
        this.newQuizTitle = '';
        this.loadCourse(c.id);
      },
      error: (err) => {
        this.quizError.set(err?.error?.message ?? err?.message ?? 'Failed to add quiz');
      },
      complete: () => this.addingQuiz.set(false),
    });
  }
}
