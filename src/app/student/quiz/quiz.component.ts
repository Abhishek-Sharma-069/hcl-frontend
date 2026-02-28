import { Component, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuizService, type QuizQuestion } from '../../core/services/quiz.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="space-y-6 max-w-2xl mx-auto">
      <a
        [routerLink]="['/student/course', courseId()]"
        class="inline-flex items-center gap-2 text-stone-500 hover:text-indigo-600 text-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to course
      </a>

      @if (submitted()) {
        <div class="bg-white rounded-2xl border border-stone-200 p-8 text-center shadow-sm">
          <div class="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-display font-bold text-stone-900">Quiz complete!</h2>
          <p class="mt-2 text-stone-600">Your score: <span class="font-semibold text-teal-600">{{ scoreDisplay() }}</span></p>
          <a
            [routerLink]="['/student/course', courseId()]"
            class="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
          >
            Back to course
          </a>
        </div>
      } @else {
        <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div class="px-6 py-4 border-b border-stone-100 bg-stone-50/50">
            <h1 class="text-xl font-display font-bold text-stone-900">{{ quizTitle() }}</h1>
            <p class="text-sm text-stone-500 mt-1">Question {{ currentIndex() + 1 }} of {{ questions().length }}</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="p-6 sm:p-8">
            @for (q of questions(); track q.id; let i = $index) {
              <div class="mb-8" [class.hidden]="i !== currentIndex()">
                <p class="font-medium text-stone-900 mb-4">{{ q.questionText }}</p>
                <input
                  type="text"
                  [ngModel]="getAnswer(q.id)"
                  (ngModelChange)="setAnswer(q.id, $event)"
                  [name]="'q' + q.id"
                  placeholder="Type your answer..."
                  class="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>
            }

            <div class="flex gap-4 mt-8">
              @if (currentIndex() > 0) {
                <button
                  type="button"
                  (click)="prevQuestion()"
                  class="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium"
                >
                  Previous
                </button>
              }
              @if (currentIndex() < questions().length - 1) {
                <button
                  type="button"
                  (click)="nextQuestion()"
                  class="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Next
                </button>
              }
              @if (currentIndex() === questions().length - 1) {
                <button
                  type="submit"
                  [disabled]="loading()"
                  class="ml-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl transition-colors"
                >
                  {{ loading() ? 'Submitting...' : 'Submit quiz' }}
                </button>
              }
            </div>
          </form>
        </div>
      }
    </div>
  `,
})
export class QuizComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private quizService = inject(QuizService);
  private auth = inject(AuthService);

  courseId = signal(0);
  quizId = signal(0);
  quizTitle = signal('Quiz');
  questions = signal<QuizQuestion[]>([]);
  answers = signal<Record<number, string>>({});
  currentIndex = signal(0);
  loading = signal(false);
  submitted = signal(false);
  score = signal(0);
  totalQuestions = signal(0);

  scoreDisplay = () => {
    const s = this.score();
    const t = this.totalQuestions();
    return t > 0 ? `${s}/${t}` : `${s}`;
  };

  ngOnInit() {
    const cid = Number(this.route.snapshot.paramMap.get('courseId'));
    const qid = Number(this.route.snapshot.paramMap.get('quizId'));
    this.courseId.set(cid);
    this.quizId.set(qid);
    this.quizService.getById(qid).subscribe({
      next: (quiz) => {
        this.quizTitle.set(quiz.title);
        this.questions.set(quiz.questions ?? []);
        this.totalQuestions.set((quiz.questions ?? []).length);
        const initial: Record<number, string> = {};
        (quiz.questions ?? []).forEach((q) => (initial[q.id] = ''));
        this.answers.set(initial);
      },
    });
  }

  getAnswer(questionId: number): string {
    return this.answers()[questionId] ?? '';
  }

  setAnswer(questionId: number, value: string): void {
    this.answers.update((prev) => ({ ...prev, [questionId]: value }));
  }

  prevQuestion(): void {
    this.currentIndex.update((i) => (i > 0 ? i - 1 : 0));
  }

  nextQuestion(): void {
    this.currentIndex.update((i) =>
      i < this.questions().length - 1 ? i + 1 : i
    );
  }

  onSubmit() {
    const studentId = this.auth.getUser()?.id;
    if (!studentId) return;
    this.loading.set(true);
    const ans = this.answers();
    const answersRecord: Record<string, string> = {};
    this.questions().forEach((q) => {
      const v = ans[q.id];
      if (v) answersRecord[String(q.id)] = v;
    });
    this.quizService.submit(this.quizId(), { studentId, answers: answersRecord }).subscribe({
      next: (res) => {
        const score = typeof res === 'number' ? res : (res as { score?: number; correctAnswers?: number }).score ?? (res as { correctAnswers?: number }).correctAnswers ?? 0;
        this.score.set(score);
        this.submitted.set(true);
      },
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false),
    });
  }
}
