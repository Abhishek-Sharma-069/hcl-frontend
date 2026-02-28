import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  content: string;
  orderIndex: number;
}

@Injectable({ providedIn: 'root' })
export class LessonService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getById(lessonId: number): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.apiUrl}/lessons/${lessonId}`);
  }

  getByCourse(courseId: number, params?: { page?: number; pageSize?: number }): Observable<Lesson[]> {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.pageSize) q.set('pageSize', String(params.pageSize));
    const query = q.toString() ? `?${q}` : '';
    return this.http.get<{ data: Lesson[] } | Lesson[]>(`${this.apiUrl}/courses/${courseId}/lessons${query}`).pipe(
      map((res) => (Array.isArray(res) ? res : (res as { data: Lesson[] }).data ?? []))
    );
  }
}
