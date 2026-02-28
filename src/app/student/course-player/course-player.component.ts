import { Component, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { ProgressService } from '../../core/services/progress.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-6">
      <a
        [routerLink]="['/student/course', courseId()]"
        class="inline-flex items-center gap-2 text-stone-500 hover:text-indigo-600 text-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to course
      </a>

      @if (lesson()) {
        <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <!-- Video/Content area placeholder -->
          <div class="aspect-video bg-stone-100 flex items-center justify-center">
            <div class="text-center">
              <div class="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-stone-500">Lesson content / video player</p>
            </div>
          </div>

          <div class="p-6 sm:p-8">
            <h1 class="text-2xl font-display font-bold text-stone-900">{{ lesson()!.title }}</h1>
            <div class="mt-6 prose prose-stone max-w-none">
              <p class="text-stone-600 whitespace-pre-wrap">{{ lesson()!.content }}</p>
            </div>

            <div class="mt-8 flex flex-wrap gap-4">
              <button
                (click)="markComplete()"
                [disabled]="completed()"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors"
                [class.bg-teal-100]="completed()"
                [class.text-teal-700]="completed()"
                [class.bg-indigo-600]="!completed()"
                [class.text-white]="!completed()"
                [class.hover:bg-indigo-700]="!completed()"
              >
                @if (completed()) {
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Completed
                } @else {
                  Mark as complete
                }
              </button>
              @if (nextLessonId()) {
                <a
                  [routerLink]="['/student/course', courseId(), 'lesson', nextLessonId()]"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl transition-colors"
                >
                  Next lesson
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              }
            </div>
          </div>
        </div>
      } @else {
        <p class="text-stone-500">Loading lesson...</p>
      }
    </div>
  `,
})
export class CoursePlayerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private progressService = inject(ProgressService);
  private auth = inject(AuthService);

  courseId = signal(0);
  lessonId = signal(0);
  lesson = signal<{ id: number; title: string; content: string } | null>(null);
  completed = signal(false);
  nextLessonId = signal<number | null>(null);

  ngOnInit() {
    const cid = Number(this.route.snapshot.paramMap.get('courseId'));
    const lid = Number(this.route.snapshot.paramMap.get('lessonId'));
    this.courseId.set(cid);
    this.lessonId.set(lid);
    this.courseService.getById(cid).subscribe({
      next: (course) => {
        const lessons = (course.lessons ?? []) as { id: number; title: string; content?: string }[];
        const current = lessons.find((l) => l.id === lid) ?? lessons[0];
        this.lesson.set(current ? { id: current.id, title: current.title, content: current.content ?? '' } : null);
        const idx = lessons.findIndex((l) => l.id === lid);
        if (idx >= 0 && idx < lessons.length - 1) this.nextLessonId.set(lessons[idx + 1].id);
      },
    });
  }

  markComplete() {
    const lid = this.lessonId();
    const studentId = this.auth.getUser()?.id;
    if (!lid || !studentId) {
      this.completed.set(true);
      return;
    }
    this.progressService.markLessonComplete(lid, studentId).subscribe({
      next: () => this.completed.set(true),
      error: () => this.completed.set(true),
    });
  }
}
