import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { UtilityService } from '../../services/utility.service';
import { AuthService } from '../../services/auth.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-take-exam',
  template: `
    <div *ngIf="exam; else loading">
      <h2>{{ exam.title }}</h2>
      <div>Time Remaining: {{ remainingTime }}</div>
      <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
      <div *ngIf="exam.questions.length > 0">
        <div *ngFor="let question of exam.questions; let i = index">
          <p>{{ i + 1 }}. {{ question.question }}</p>
          <div *ngIf="question.type === 'mcq'">
            <div *ngFor="let option of question.options; let j = index">
              <label>
                <input type="radio" [name]="'question-' + i" [(ngModel)]="answers[i]" [value]="j">
                {{ option }}
              </label>
            </div>
          </div>
          <div *ngIf="question.type === 'subjective'">
            <textarea [(ngModel)]="answers[i]" rows="4" cols="50"></textarea>
          </div>
        </div>
        <button (click)="confirmSubmit()" [disabled]="isSubmitting">Submit Exam</button>
      </div>
      <div *ngIf="exam.questions.length === 0">
        <p>No questions available. Please contact the examiner.</p>
      </div>
    </div>
    <ng-template #loading>
      <p>Loading exam...</p>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    h2 {
      font-size: 1.8rem;
      color: #1a202c;
      margin-bottom: 1.5rem;
      font-weight: 600;
      text-align: center;
    }

    .error {
      color: #e53e3e;
      background-color: #fff5f5;
      padding: 0.75rem;
      border-radius: 0.375rem;
      margin: 1rem 0;
      font-size: 0.9rem;
      text-align: center;
    }

    .timer {
      font-size: 1.1rem;
      color: #2d3748;
      margin-bottom: 1.5rem;
      font-weight: 500;
      text-align: center;
    }

    div[ngIf="exam.questions.length > 0"] {
      background-color: #ffffff;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;
    }

    p {
      font-size: 1rem;
      color: #2d3748;
      margin: 0.75rem 0;
      font-weight: 500;
    }

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
      color: #4a5568;
      margin: 0.5rem 0;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.25rem;
      transition: background-color 0.2s ease;
    }

    label:hover {
      background-color: #edf2f7;
    }

    input[type="radio"] {
      accent-color: #3182ce;
      width: 1.2rem;
      height: 1.2rem;
    }

    textarea {
      width: 100%;
      max-width: 100%;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      font-size: 0.95rem;
      color: #2d3748;
      resize: vertical;
      transition: border-color 0.2s ease;
    }

    textarea:focus {
      outline: none;
      border-color: #3182ce;
      box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
    }

    button {
      display: block;
      width: 100%;
      max-width: 200px;
      margin: 1.5rem auto;
      padding: 0.75rem 1.5rem;
      background-color: #3182ce;
      color: #ffffff;
      border: none;
      border-radius: 0.375rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;
    }

    button:hover:not(:disabled) {
      background-color: #2b6cb0;
      transform: translateY(-1px);
    }

    button:disabled {
      background-color: #a0aec0;
      cursor: not-allowed;
      opacity: 0.7;
    }

    div[ngIf="exam.questions.length === 0"] p {
      text-align: center;
      color: #e53e3e;
      font-size: 1rem;
      margin: 1.5rem 0;
    }

    ng-template#loading p {
      text-align: center;
      font-size: 1.1rem;
      color: #4a5568;
      margin: 2rem 0;
    }

    @media (max-width: 600px) {
      :host {
        padding: 1rem;
      }

      h2 {
        font-size: 1.5rem;
      }

      button {
        max-width: 100%;
      }
    }
  `]
})
export class TakeExamComponent implements OnInit, OnDestroy {
  exam: any = null;
  remainingTime: string = '';
  answers: any[] = [];
  errorMessage: string = '';
  isSubmitting: boolean = false;
  private timerSubscription: Subscription | null = null;
  private startTime: Date | null = null;
  private durationSeconds: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private utilityService: UtilityService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const examId = this.route.snapshot.paramMap.get('id');
    if (examId) {
      this.examService.getExams().subscribe({
        next: (exams) => {
          this.exam = exams.find((e: any) => e.exam_id === examId);
          if (this.exam) {
            this.answers = new Array(this.exam.questions.length).fill(null);
            this.durationSeconds = this.exam.duration * 60;
            this.examService.startExam(examId).subscribe({
              next: (response) => {
                this.startTime = new Date(response.start_time);
                this.startTimer();
              },
              error: (err) => {
                this.errorMessage = err.error?.message || 'Failed to start exam';
                console.error('Start exam error:', err);
              }
            });
          } else {
            this.errorMessage = 'Exam not found';
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to fetch exam';
          console.error('Fetch exam error:', err);
        }
      });
    } else {
      this.errorMessage = 'Invalid exam ID';
    }
  }

  startTimer(): void {
    if (!this.startTime || !this.durationSeconds) {
      this.errorMessage = 'Timer initialization failed';
      return;
    }

    this.timerSubscription = interval(1000).subscribe(() => {
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - this.startTime!.getTime()) / 1000);
      const remainingSeconds = Math.max(0, this.durationSeconds - elapsedSeconds);

      this.remainingTime = this.utilityService.formatDuration(remainingSeconds);

      if (remainingSeconds <= 0 && !this.isSubmitting) {
        this.submitExam(false); // Auto-submit without confirmation
      }
    });
  }

  confirmSubmit(): void {
    if (this.isSubmitting) return;
    const confirmSubmission = confirm('Are you sure you want to submit the exam?');
    if (confirmSubmission) {
      this.submitExam(true); // Manual submit with navigation
    }
  }

  submitExam(navigateAfter: boolean): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    const examId = this.route.snapshot.paramMap.get('id');
    if (!examId) {
      this.errorMessage = 'Invalid exam ID';
      this.isSubmitting = false;
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage = 'User not authenticated';
      this.isSubmitting = false;
      return;
    }

    this.examService.submitExam(examId, this.answers).subscribe({
      next: () => {
        this.timerSubscription?.unsubscribe();
        this.errorMessage = 'Exam submitted successfully';
        this.isSubmitting = false;
        if (navigateAfter) {
          this.router.navigate(['/student-dashboard']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to submit exam';
        this.isSubmitting = false;
        console.error('Submit exam error:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }
}