import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressService } from '../../core/services/progress.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-8">
      <div>
        <h1 class="text-3xl font-display font-bold text-stone-900">My Progress</h1>
        <p class="mt-1 text-stone-500">Track your learning journey</p>
      </div>

      <!-- Summary cards -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <p class="text-sm font-medium text-stone-500">Lessons completed</p>
          <p class="mt-1 text-3xl font-display font-bold text-stone-900">{{ summary().lessonsCompleted }}</p>
        </div>
        <div class="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <p class="text-sm font-medium text-stone-500">Quizzes taken</p>
          <p class="mt-1 text-3xl font-display font-bold text-stone-900">{{ summary().quizzesTaken }}</p>
        </div>
        <div class="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <p class="text-sm font-medium text-stone-500">Average quiz score</p>
          <p class="mt-1 text-3xl font-display font-bold text-stone-900">{{ summary().avgScore }}%</p>
        </div>
        <div class="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <p class="text-sm font-medium text-stone-500">Overall completion</p>
          <p class="mt-1 text-3xl font-display font-bold text-stone-900">{{ summary().overallCompletion }}%</p>
        </div>
      </div>

      <!-- Course progress -->
      <div>
        <h2 class="text-xl font-display font-semibold text-stone-900 mb-4">Course progress</h2>
        <div class="space-y-4">
          @for (course of courseProgress(); track course.id) {
            <a
              [routerLink]="['/student/course', course.id]"
              class="block bg-white rounded-xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0 flex-1">
                  <h3 class="font-semibold text-stone-900">{{ course.title }}</h3>
                  <p class="mt-1 text-sm text-stone-500">{{ course.lessonsCompleted }}/{{ course.totalLessons }} lessons · {{ course.quizScores.length }} quiz{{ course.quizScores.length !== 1 ? 'zes' : '' }} taken</p>
                  <div class="mt-3 h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-indigo-500 rounded-full transition-all"
                      [style.width.%]="course.percentComplete"
                    ></div>
                  </div>
                </div>
                <span class="text-lg font-display font-bold text-indigo-600 shrink-0">{{ course.percentComplete }}%</span>
              </div>
              @if (course.quizScores.length > 0) {
                <div class="mt-4 flex flex-wrap gap-2">
                  @for (score of course.quizScores; track score.quizTitle) {
                    <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 text-sm">
                      {{ score.quizTitle }}: {{ score.score }}%
                    </span>
                  }
                </div>
              }
            </a>
          }
        </div>
      </div>
    </div>
  `,
})
export class ProgressComponent implements OnInit {
  private progressService = inject(ProgressService);
  private enrollmentService = inject(EnrollmentService);
  private auth = inject(AuthService);

  courseProgress = signal<{
    id: number;
    title: string;
    lessonsCompleted: number;
    totalLessons: number;
    percentComplete: number;
    quizScores: { quizTitle: string; score: number }[];
  }[]>([]);
  summary = signal({ lessonsCompleted: 0, quizzesTaken: 0, avgScore: 0, overallCompletion: 0 });

  ngOnInit() {
    const studentId = this.auth.getUser()?.id;
    if (!studentId) return;
    this.enrollmentService.getByStudent(studentId).subscribe({
      next: (enrollments) => {
        const courses = enrollments.map((e) => ({
          id: e.course?.id ?? e.courseId,
          title: e.course?.title ?? 'Course',
          lessonsCompleted: 0,
          totalLessons: 0,
          percentComplete: 0,
          quizScores: [] as { quizTitle: string; score: number }[],
        }));
        this.courseProgress.set(courses);
      },
    });
    this.progressService.getByStudent(studentId).subscribe({
      next: (items) => {
        const completed = items.filter((i) => i.completed).length;
        const quizItems = items.filter((i) => i.quizScore != null);
        const avg = quizItems.length ? Math.round(quizItems.reduce((a, i) => a + (i.quizScore ?? 0), 0) / quizItems.length) : 0;
        this.summary.update((s) => ({
          ...s,
          lessonsCompleted: completed,
          quizzesTaken: quizItems.length,
          avgScore: avg,
          overallCompletion: completed > 0 ? Math.min(100, Math.round((completed / (completed + 5)) * 100)) : 0,
        }));
      },
      error: () => {},
    });
  }
}
