import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface EnrollmentCourse {
  id: number;
  title: string;
  description?: string;
}

export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  course?: EnrollmentCourse;
  enrolledAt: string;
}

export interface PaginatedEnrollments {
  data: Enrollment[];
}

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/enrollment`;

  enroll(studentId: number, courseId: number): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.apiUrl}?studentId=${studentId}&courseId=${courseId}`, {});
  }

  getByStudent(studentId: number): Observable<Enrollment[]> {
    return this.http
      .get<Enrollment[] | PaginatedEnrollments>(`${this.apiUrl}/student/${studentId}`)
      .pipe(map((res) => (Array.isArray(res) ? res : (res as PaginatedEnrollments).data ?? [])));
  }
}
