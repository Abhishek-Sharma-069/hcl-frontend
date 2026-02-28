import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseService, type CourseListItem } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-instructor-courses',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-display font-bold text-stone-900">My Courses</h1>
          <p class="mt-1 text-stone-500">Manage your courses, lessons, and quizzes</p>
        </div>
        <a routerLink="/instructor/courses/new" class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-colors">Create course</a>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (course of myCourses(); track course.id) {
          <a [routerLink]="['/instructor/courses', course.id, 'edit']" class="group bg-white rounded-xl border border-stone-200 p-5 shadow-sm hover:shadow-md hover:border-teal-200 transition-all">
            <h3 class="font-semibold text-stone-900 group-hover:text-teal-600">{{ course.title }}</h3>
            <p class="mt-2 text-sm text-stone-500 line-clamp-2">{{ course.description }}</p>
            <span class="mt-3 inline-block text-teal-600 text-sm font-medium">Edit →</span>
          </a>
        }
      </div>
      @if (loading()) {
        <p class="text-stone-500">Loading...</p>
      }
      @if (!loading() && myCourses().length === 0) {
        <div class="text-center py-12 text-stone-500">
          <p>You haven't created any courses yet.</p>
          <a routerLink="/instructor/courses/new" class="mt-4 inline-block text-teal-600 font-medium">Create your first course</a>
        </div>
      }
    </div>
  `,
})
export class InstructorCoursesComponent implements OnInit {
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
