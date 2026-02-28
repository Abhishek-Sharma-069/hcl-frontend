import { Component, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService, type CourseDetail } from '../../core/services/course.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-8">
      <a routerLink="/student/catalog" class="inline-flex items-center gap-2 text-stone-500 hover:text-indigo-600 text-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to catalog
      </a>

      @if (course()) {
        <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div class="h-48 sm:h-64 bg-gradient-to-br from-indigo-200 via-indigo-100 to-teal-100 flex items-center justify-center">
            <span class="text-8xl font-display font-bold text-indigo-400/50">{{ course()!.title.charAt(0) }}</span>
          </div>
          <div class="p-6 sm:p-8">
            <h1 class="text-2xl sm:text-3xl font-display font-bold text-stone-900">{{ course()!.title }}</h1>
            <p class="mt-4 text-stone-600">{{ course()!.description }}</p>

            <div class="mt-6 flex flex-wrap gap-4">
              <span class="inline-flex items-center gap-1.5 text-stone-500 text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {{ (course()!.lessons ?? []).length }} lessons
              </span>
              <span class="inline-flex items-center gap-1.5 text-stone-500 text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {{ (course()!.quizzes ?? []).length }} quiz{{ (course()!.quizzes ?? []).length !== 1 ? 'zes' : '' }}
              </span>
            </div>

            @if (enrolled()) {
              <a
                [routerLink]="['/student/course', course()!.id, 'lesson', (course()!.lessons ?? [])[0]?.id]"
                class="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
              >
                Continue learning
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            } @else {
              <button
                (click)="enroll()"
                [disabled]="enrolling()"
                class="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl transition-colors"
              >
                {{ enrolling() ? 'Enrolling...' : 'Enroll in course' }}
              </button>
            }
          </div>
        </div>

        <!-- Lessons (always visible) -->
        <div class="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
          <h2 class="px-6 py-4 font-display font-semibold text-stone-900 border-b border-stone-100">Lessons</h2>
          <div class="divide-y divide-stone-100">
            @if ((course()!.lessons ?? []).length > 0) {
              @for (lesson of (course()!.lessons ?? []); track lesson.id; let i = $index) {
                <a
                  [routerLink]="['/student/course', course()!.id, 'lesson', lesson.id]"
                  class="flex items-center gap-4 px-6 py-4 hover:bg-stone-50/50 transition-colors"
                >
                  <span class="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm font-medium text-stone-600 shrink-0">
                    {{ i + 1 }}
                  </span>
                  <div class="min-w-0 flex-1">
                    <p class="font-medium text-stone-900">{{ lesson.title }}</p>
                  </div>
                  <svg class="w-5 h-5 text-stone-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              }
            } @else {
              <div class="px-6 py-6 text-stone-500 text-sm">No lessons in this course yet.</div>
            }
          </div>
        </div>

        <!-- Quizzes (always visible) -->
        <div class="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
          <h2 class="px-6 py-4 font-display font-semibold text-stone-900 border-b border-stone-100">Quizzes</h2>
          <div class="divide-y divide-stone-100">
            @if ((course()!.quizzes ?? []).length > 0) {
              @for (quiz of (course()!.quizzes ?? []); track quiz.id) {
                <a
                  [routerLink]="['/student/course', course()!.id, 'quiz', quiz.id]"
                  class="flex items-center gap-4 px-6 py-4 hover:bg-stone-50/50 transition-colors"
                >
                  <div class="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="font-medium text-stone-900">{{ quiz.title }}</p>
                  </div>
                  <span class="text-sm text-indigo-600 font-medium">Take quiz →</span>
                </a>
              }
            } @else {
              <div class="px-6 py-6 text-stone-500 text-sm">No quizzes in this course yet. Check back later.</div>
            }
          </div>
        </div>
      } @else {
        <p class="text-stone-500">Loading course...</p>
      }
    </div>
  `,
})
export class CourseDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private auth = inject(AuthService);

  course = signal<CourseDetail | null>(null);
  enrolled = signal(false);
  enrolling = signal(false);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.courseService.getById(id).subscribe({
      next: (c) => this.course.set(c),
      error: () => this.course.set(null),
    });
    const studentId = this.auth.getUser()?.id;
    if (studentId) {
      this.enrollmentService.getByStudent(studentId).subscribe({
        next: (enrollments) => this.enrolled.set(enrollments.some((e) => e.courseId === id)),
      });
    }
  }

  enroll() {
    const c = this.course();
    const studentId = this.auth.getUser()?.id;
    if (!c || !studentId) return;
    this.enrolling.set(true);
    this.enrollmentService.enroll(studentId, c.id).subscribe({
      next: () => this.enrolled.set(true),
      error: () => {},
      complete: () => this.enrolling.set(false),
    });
  }
}
