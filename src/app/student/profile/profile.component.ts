import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { EnrollmentService } from '../../core/services/enrollment.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="space-y-8 max-w-2xl">
      <div>
        <h1 class="text-3xl font-display font-bold text-stone-900">Profile</h1>
        <p class="mt-1 text-stone-500">Manage your account and view enrolled courses</p>
      </div>

      <!-- My info -->
      <div class="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
        <h2 class="px-6 py-4 font-display font-semibold text-stone-900 border-b border-stone-100">My info</h2>
        <form class="p-6 space-y-4">
          <div>
            <label for="fullName" class="block text-sm font-medium text-stone-700 mb-1.5">Full name</label>
            <input
              id="fullName"
              type="text"
              [(ngModel)]="fullName"
              name="fullName"
              readonly
              class="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              [(ngModel)]="email"
              name="email"
              readonly
              class="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>
          <button
            type="button"
            class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
          >
            Save changes
          </button>
        </form>
      </div>

      <!-- Enrolled courses -->
      <div class="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
        <h2 class="px-6 py-4 font-display font-semibold text-stone-900 border-b border-stone-100">My enrolled courses</h2>
        <div class="divide-y divide-stone-100">
          @for (course of enrolledCourses(); track course.id) {
            <a
              [routerLink]="['/student/course', course.id]"
              class="flex items-center gap-4 px-6 py-4 hover:bg-stone-50/50 transition-colors"
            >
              <div class="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                <span class="text-lg font-display font-bold text-indigo-600">{{ course.title.charAt(0) }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-medium text-stone-900">{{ course.title }}</p>
                <p class="text-sm text-stone-500">{{ course.progress }}% complete</p>
              </div>
              <svg class="w-5 h-5 text-stone-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          }
        </div>
        @if (enrolledCourses().length === 0) {
          <div class="px-6 py-12 text-center text-stone-500">
            <p>You haven't enrolled in any courses yet.</p>
            <a routerLink="/student/catalog" class="mt-2 inline-block text-indigo-600 hover:text-indigo-700 font-medium">Browse catalog</a>
          </div>
        }
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  private auth = inject(AuthService);
  private enrollmentService = inject(EnrollmentService);

  fullName = '';
  email = '';
  enrolledCourses = signal<{ id: number; title: string; progress: number }[]>([]);

  ngOnInit() {
    const user = this.auth.getUser();
    if (user) {
      this.fullName = user.name ?? '';
      this.email = user.email ?? '';
    }
    const studentId = user?.id;
    if (studentId) {
      this.enrollmentService.getByStudent(studentId).subscribe({
        next: (enrollments) =>
          this.enrolledCourses.set(
            enrollments.map((e) => ({
              id: e.course?.id ?? e.courseId,
              title: e.course?.title ?? 'Course',
              progress: 0,
            }))
          ),
      });
    }
  }
}
