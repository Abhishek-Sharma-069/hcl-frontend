import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Instructor {
  id: number;
  name: string;
  email?: string;
}

export interface LessonSummary {
  id: number;
  title: string;
  content?: string;
  orderIndex?: number;
}

export interface LessonDetail extends LessonSummary {
  courseId: number;
  content: string;
}

export interface QuizSummary {
  id: number;
  title: string;
}

export interface CourseListItem {
  id: number;
  title: string;
  description: string;
  instructorId: number;
  instructor?: Instructor;
  createdAt: string;
}

export interface CourseDetail extends CourseListItem {
  lessons: LessonSummary[];
  quizzes: QuizSummary[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/course`;

  getAll(params?: { page?: number; pageSize?: number; search?: string }): Observable<CourseListItem[]> {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.pageSize) q.set('pageSize', String(params.pageSize));
    if (params?.search) q.set('search', params.search);
    const query = q.toString() ? `?${q}` : '';
    return this.http.get<CourseListItem[] | PaginatedResponse<CourseListItem>>(`${this.apiUrl}${query}`).pipe(
      map((res) => (Array.isArray(res) ? res : (res as PaginatedResponse<CourseListItem>).data ?? []))
    );
  }

  getById(id: number): Observable<CourseDetail> {
    return this.http.get<CourseDetail>(`${this.apiUrl}/${id}`).pipe(
      map((c) => ({
        ...c,
        lessons: (c.lessons ?? []).sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)),
      }))
    );
  }

  create(payload: { title: string; description: string; instructorId?: number }): Observable<CourseListItem> {
    return this.http.post<CourseListItem>(this.apiUrl, payload);
  }

  update(id: number, payload: { title: string; description: string; instructorId?: number }): Observable<CourseListItem> {
    return this.http.put<CourseListItem>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
