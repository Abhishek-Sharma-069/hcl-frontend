import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { AuthService } from '../../core/services/auth.service';
import { ProgressService } from '../../core/services/progress.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-8">
      <div>
        <h1 class="text-3xl font-display font-bold text-stone-900">Dashboard</h1>
        <p class="mt-1 text-stone-500">Welcome back! Here's your learning overview.</p>
      </div>

      <!-- Progress Overview -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span class="font-medium text-stone-700">Courses Enrolled</span>
          </div>
          <p class="text-3xl font-display font-bold text-stone-900">{{ stats().enrolled }}</p>
        </div>
        <div class="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="font-medium text-stone-700">Lessons Completed</span>
          </div>
          <p class="text-3xl font-display font-bold text-stone-900">{{ stats().lessonsCompleted }}</p>
        </div>
        <div class="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span class="font-medium text-stone-700">Overall Progress</span>
          </div>
          <p class="text-3xl font-display font-bold text-stone-900">{{ stats().overallProgress }}%</p>
        </div>
      </div>

      <!-- Enrolled Courses -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-display font-semibold text-stone-900">Enrolled Courses</h2>
          <a routerLink="/student/catalog" class="text-indigo-600 hover:text-indigo-700 text-sm font-medium">Browse all</a>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (course of enrolledCourses(); track course.id) {
            <a
              [routerLink]="['/student/course', course.id]"
              class="group bg-white rounded-xl border border-stone-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
            >
              <div class="h-24 rounded-lg bg-gradient-to-br from-indigo-100 to-teal-100 mb-4 flex items-center justify-center">
                <span class="text-3xl font-display font-bold text-indigo-600/60">{{ course.title.charAt(0) }}</span>
              </div>
              <h3 class="font-semibold text-stone-900 group-hover:text-indigo-600 transition-colors">{{ course.title }}</h3>
              <div class="mt-2 h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                <div class="h-full bg-indigo-500 rounded-full" [style.width.%]="course.progress || 0"></div>
              </div>
              <p class="mt-2 text-sm text-stone-500">{{ course.progress || 0 }}% complete</p>
            </a>
          }
        </div>
      </div>

      <!-- Recent Activity -->
      <div>
        <h2 class="text-xl font-display font-semibold text-stone-900 mb-4">Recent Activity</h2>
        <div class="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
          @for (activity of recentActivity(); track activity.id) {
            <div class="flex items-center gap-4 p-4 hover:bg-stone-50/50 transition-colors">
              <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                [class.bg-indigo-100]="activity.type === 'lesson'"
                [class.bg-teal-100]="activity.type === 'quiz'"
              >
                @if (activity.type === 'lesson') {
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                } @else {
                  <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                }
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-medium text-stone-900">{{ activity.title }}</p>
                <p class="text-sm text-stone-500">{{ activity.time }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private auth = inject(AuthService);
  private progressService = inject(ProgressService);

  enrolledCourses = signal<{ id: number; title: string; progress: number }[]>([]);
  recentActivity = signal<{ id: number; type: string; title: string; time: string }[]>([]);
  stats = signal({ enrolled: 0, lessonsCompleted: 0, overallProgress: 0 });

  ngOnInit() {
    const studentId = this.auth.getUser()?.id;
    if (!studentId) return;
    this.enrollmentService.getByStudent(studentId).subscribe({
      next: (enrollments) => {
        const courses = enrollments.map((e) => ({
          id: e.course?.id ?? e.courseId,
          title: e.course?.title ?? 'Course',
          progress: 0,
        }));
        this.enrolledCourses.set(courses);
        this.stats.update((s) => ({ ...s, enrolled: courses.length }));
      },
    });
    this.progressService.getByStudent(studentId).subscribe({
      next: (items) => {
        const completed = items.filter((i) => i.completed).length;
        this.stats.update((s) => ({ ...s, lessonsCompleted: completed }));
        const activities = items.slice(0, 5).map((p, i) => ({
          id: i + 1,
          type: p.lessonId ? 'lesson' : 'quiz',
          title: p.lesson ? `Completed: ${p.lesson.title}` : p.quiz ? `Quiz: ${p.quiz.title} - ${p.quizScore ?? 0}%` : 'Activity',
          time: 'Recently',
        }));
        this.recentActivity.set(activities);
      },
      error: () => {
        this.recentActivity.set([
          { id: 1, type: 'lesson', title: 'Completed: Components & Templates', time: '2 hours ago' },
          { id: 2, type: 'quiz', title: 'Quiz: Module 2 - 85%', time: 'Yesterday' },
        ]);
      },
    });
  }
}
