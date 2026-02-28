import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface QuizQuestion {
  id: number;
  quizId?: number;
  questionText: string;
  correctAnswer: string;
}

export interface Quiz {
  id: number;
  courseId: number;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizSubmitRequest {
  studentId: number;
  answers: Record<string, string>;
}

export interface QuizSubmitResponse {
  quizId: number;
  studentId: number;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  submittedAt: string;
}

@Injectable({ providedIn: 'root' })
export class QuizService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/quiz`;

  getById(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${id}`);
  }

  submit(quizId: number, body: QuizSubmitRequest): Observable<QuizSubmitResponse | number> {
    return this.http.post<QuizSubmitResponse | number>(`${this.apiUrl}/submit`, {
      quizId,
      answers: body.answers,
    });
  }
}
