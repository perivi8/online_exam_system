import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-evaluate-exam',
  templateUrl: './evaluate-exam.component.html',
  styleUrls: ['./evaluate-exam.component.scss']
})
export class EvaluateExamComponent implements OnInit {
  exams: any[] = [];
  submissions: any[] = [];
  selectedExamId: string = '';
  selectedSubmission: any = null;
  subjectiveMarks: number[] = [];
  rank: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    const headers = this.authService.getAuthHeaders();
    this.http.get('https://one-line-exam-2-3.onrender.com/api/get-exams', { headers }).subscribe({
      next: (response: any) => {
        this.exams = response;
      },
      error: (err) => {
        this.errorMessage = `Failed to load exams: ${err.error?.message || 'Unknown error'}`;
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  loadSubmissions(): void {
    if (!this.selectedExamId) {
      this.submissions = [];
      return;
    }
    const headers = this.authService.getAuthHeaders();
    this.http.get(`https://one-line-exam-2-3.onrender.com/api/get-submissions/${this.selectedExamId}`, { headers }).subscribe({
      next: (response: any) => {
        this.submissions = response.filter((sub: any) => sub.status === 'submitted');
      },
      error: (err) => {
        this.errorMessage = `Failed to load submissions: ${err.error?.message || 'Unknown error'}`;
      }
    });
  }

  evaluateSubmission(submission: any): void {
    const headers = this.authService.getAuthHeaders();
    this.http.get(`https://one-line-exam-2-3.onrender.com/api/get-submission/${submission.exam_id}/${submission.user_email}`, { headers }).subscribe({
      next: (response: any) => {
        this.selectedSubmission = response;
        this.subjectiveMarks = new Array(response.questions.length).fill(0);
      },
      error: (err) => {
        this.errorMessage = `Failed to load submission: ${err.error?.message || 'Unknown error'}`;
      }
    });
  }

  submitEvaluation(): void {
    const headers = this.authService.getAuthHeaders();
    const payload = {
      exam_id: this.selectedSubmission.exam_id,
      user_email: this.selectedSubmission.user_email,
      subjective_marks: this.subjectiveMarks,
      rank: this.rank
    };
    this.http.post('https://one-line-exam-2-3.onrender.com/api/evaluate-exam', payload, { headers }).subscribe({
      next: () => {
        this.successMessage = 'Evaluation submitted successfully!';
        this.errorMessage = '';
        this.selectedSubmission = null;
        this.loadSubmissions();
      },
      error: (err) => {
        this.errorMessage = `Failed to submit evaluation: ${err.error?.message || 'Unknown error'}`;
      }
    });
  }
} 