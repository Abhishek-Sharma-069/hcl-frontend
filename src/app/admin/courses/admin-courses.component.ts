import { Component, signal, inject, OnInit } from '@angular/core';
import { CourseService, type CourseListItem } from '../../core/services/course.service';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-display font-bold text-stone-900">All Courses</h1>
        <p class="mt-1 text-stone-500">Manage courses across the platform</p>
      </div>
      <div class="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table class="min-w-full divide-y divide-stone-200">
          <thead class="bg-stone-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-stone-700">Title</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-stone-700">Description</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-stone-700">Instructor</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100">
            @for (c of courses(); track c.id) {
              <tr class="hover:bg-stone-50">
                <td class="px-4 py-3 font-medium text-stone-900">{{ c.title }}</td>
                <td class="px-4 py-3 text-sm text-stone-500 line-clamp-2 max-w-xs">{{ c.description }}</td>
                <td class="px-4 py-3 text-sm text-stone-600">{{ c.instructor?.name ?? '—' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      @if (loading()) {
        <p class="text-stone-500">Loading...</p>
      }
    </div>
  `,
})
export class AdminCoursesComponent implements OnInit {
  private courseService = inject(CourseService);

  courses = signal<CourseListItem[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.courseService.getAll().subscribe({
      next: (data) => this.courses.set(data),
      error: () => this.courses.set([]),
      complete: () => this.loading.set(false),
    });
  }
}
