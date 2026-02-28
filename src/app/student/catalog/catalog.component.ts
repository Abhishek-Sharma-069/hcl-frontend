import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService, type CourseListItem } from '../../core/services/course.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-display font-bold text-stone-900">Course Catalog</h1>
        <p class="mt-1 text-stone-500">Browse and enroll in courses</p>
      </div>

      <!-- Search & Filter -->
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="Search courses..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
          />
        </div>
        <select
          [ngModel]="selectedCategory()"
          (ngModelChange)="selectedCategory.set($event)"
          class="px-4 py-2.5 rounded-xl border border-stone-200 bg-white focus:border-indigo-500 outline-none"
        >
          <option value="">All categories</option>
          <option value="web">Web Development</option>
          <option value="angular">Angular</option>
          <option value="api">APIs</option>
        </select>
      </div>

      <!-- Course Grid -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        @for (course of filteredCourses(); track course.id) {
          <a
            [routerLink]="['/student/course', course.id]"
            class="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all"
          >
            <div class="h-36 bg-gradient-to-br from-indigo-100 via-stone-100 to-teal-100 flex items-center justify-center">
              <span class="text-5xl font-display font-bold text-indigo-400/70">{{ course.title.charAt(0) }}</span>
            </div>
            <div class="p-5">
              <h3 class="font-semibold text-stone-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{{ course.title }}</h3>
              <p class="mt-2 text-sm text-stone-500 line-clamp-2">{{ course.description }}</p>
              <div class="mt-4 flex items-center justify-between">
                <span class="text-sm text-stone-400">{{ getLessonCount(course) }} lessons</span>
                <span class="text-indigo-600 font-medium text-sm group-hover:underline">View details →</span>
              </div>
            </div>
          </a>
        }
      </div>

      @if (filteredCourses().length === 0) {
        <div class="text-center py-16 text-stone-500">
          <p>No courses match your search.</p>
        </div>
      }
    </div>
  `,
})
export class CatalogComponent implements OnInit {
  private courseService = inject(CourseService);

  searchQuery = signal('');
  selectedCategory = signal('');
  courses = signal<CourseListItem[]>([]);
  loading = signal(true);

  filteredCourses = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const category = this.selectedCategory();
    const list = this.courses();
    if (!query && !category) return list;
    return list.filter((c) => {
      const matchesSearch = !query || (c.title?.toLowerCase().includes(query) ?? false) || (c.description?.toLowerCase().includes(query) ?? false);
      const cat = (c as { category?: string }).category;
      const matchesCategory = !category || cat === category;
      return matchesSearch && matchesCategory;
    });
  });

  getLessonCount(course: CourseListItem): number {
    return (course as { lessons?: unknown[] }).lessons?.length ?? 0;
  }

  ngOnInit() {
    this.courseService.getAll().subscribe({
      next: (data) => {
        this.courses.set(data);
      },
      error: () => this.courses.set([]),
      complete: () => this.loading.set(false),
    });
  }
}
