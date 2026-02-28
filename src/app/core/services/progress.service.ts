import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProgressItem {
  id: number;
  studentId: number;
  lessonId: number | null;
  quizId: number | null;
  completed: boolean;
  quizScore: number | null;
  lesson?: { id: number; title: string };
  quiz?: { id: number; title: string };
}

export interface ProgressListResponse {
  data: ProgressItem[];
}

export interface CourseProgressSummary {
  courseId: number;
  totalLessons: number;
  completedLessons: number;
  totalQuizzes: number;
  completedQuizzes: number;
  averageQuizScore: number;
  progressPercentage: number;
  lastUpdated: string;
}

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/progress`;

  getByStudent(studentId: number, params?: { courseId?: number; completed?: boolean }): Observable<ProgressItem[]> {
    const q = new URLSearchParams();
    if (params?.courseId) q.set('courseId', String(params.courseId));
    if (params?.completed !== undefined) q.set('completed', String(params.completed));
    const query = q.toString() ? `?${q}` : '';
    return this.http
      .get<ProgressListResponse | ProgressItem[]>(`${this.apiUrl}/student/${studentId}${query}`)
      .pipe(map((res: ProgressListResponse | ProgressItem[]) => (Array.isArray(res) ? res : (res as ProgressListResponse).data ?? [])));
  }

  markLessonComplete(lessonId: number, studentId: number): Observable<ProgressItem> {
    return this.http.post<ProgressItem>(`${this.apiUrl}/lesson/${lessonId}/complete`, { studentId });
  }

  recordQuizProgress(quizId: number, studentId: number, quizScore: number): Observable<ProgressItem> {
    return this.http.post<ProgressItem>(`${this.apiUrl}/quiz/${quizId}/record`, { studentId, quizScore });
  }

  getCourseSummary(courseId: number, studentId?: number): Observable<CourseProgressSummary> {
    const q = studentId ? `?studentId=${studentId}` : '';
    return this.http.get<CourseProgressSummary>(`${this.apiUrl}/course/${courseId}/summary${q}`);
  }
}
