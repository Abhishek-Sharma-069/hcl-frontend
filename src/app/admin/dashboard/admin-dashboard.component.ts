import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-8">
      <div>
        <h1 class="text-3xl font-display font-bold text-stone-900">Admin Dashboard</h1>
        <p class="mt-1 text-stone-500">Manage courses, students, and instructors.</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a routerLink="/admin/courses" class="bg-white rounded-xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <span class="text-xl">📚</span>
            </div>
            <span class="font-semibold text-stone-900">Courses</span>
          </div>
          <p class="text-2xl font-display font-bold text-stone-900">{{ stats().courses }}</p>
          <p class="text-sm text-stone-500">View and manage all courses</p>
        </a>
        <a routerLink="/admin/users" class="bg-white rounded-xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <span class="text-xl">👥</span>
            </div>
            <span class="font-semibold text-stone-900">Users</span>
          </div>
          <p class="text-2xl font-display font-bold text-stone-900">{{ stats().users }}</p>
          <p class="text-sm text-stone-500">Students, instructors, admins</p>
        </a>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  private courseService = inject(CourseService);
  private auth = inject(AuthService);

  stats = signal({ courses: 0, users: 0 });

  ngOnInit() {
    this.courseService.getAll().subscribe({
      next: (courses) => this.stats.update((s) => ({ ...s, courses: courses.length })),
    });
    // Users count will be set by admin-users or we could add a simple count API; for now leave 0 or fetch in users page
  }
}
