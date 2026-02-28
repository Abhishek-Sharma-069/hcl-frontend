import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseService, type CourseListItem } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-8">
      <div>
        <h1 class="text-3xl font-display font-bold text-stone-900">Instructor Dashboard</h1>
        <p class="mt-1 text-stone-500">Create and manage your courses, lessons, and quizzes.</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a routerLink="/instructor/courses/new" class="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-teal-200 bg-teal-50/50 hover:border-teal-400 hover:bg-teal-50 transition-colors">
          <span class="text-4xl mb-2">➕</span>
          <span class="font-semibold text-teal-800">Create course</span>
          <span class="text-sm text-stone-500 mt-1">Title, description, lessons, quizzes</span>
        </a>
        @for (course of myCourses(); track course.id) {
          <a [routerLink]="['/instructor/courses', course.id, 'edit']" class="group bg-white rounded-xl border border-stone-200 p-5 shadow-sm hover:shadow-md hover:border-teal-200 transition-all">
            <h3 class="font-semibold text-stone-900 group-hover:text-teal-600">{{ course.title }}</h3>
            <p class="mt-2 text-sm text-stone-500 line-clamp-2">{{ course.description }}</p>
            <span class="mt-3 inline-block text-teal-600 text-sm font-medium">Edit course →</span>
          </a>
        }
      </div>
      @if (loading()) {
        <p class="text-stone-500">Loading...</p>
      }
    </div>
  `,
})
export class InstructorDashboardComponent implements OnInit {
  private courseService = inject(CourseService);
  private auth = inject(AuthService);

  myCourses = signal<CourseListItem[]>([]);
  loading = signal(true);

  ngOnInit() {
    const userId = this.auth.getUser()?.id;
    this.courseService.getAll().subscribe({
      next: (courses) => {
        const mine = userId ? courses.filter((c) => c.instructorId === userId) : courses;
        this.myCourses.set(mine);
      },
      error: () => this.myCourses.set([]),
      complete: () => this.loading.set(false),
    });
  }
}
