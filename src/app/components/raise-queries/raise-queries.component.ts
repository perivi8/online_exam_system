import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-raise-queries',
  templateUrl: './raise-queries.component.html',
  styleUrls: ['./raise-queries.component.scss']
})
export class RaiseQueriesComponent implements OnInit {
  query = { examId: '', queryText: '' };
  exams: any[] = [];
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
    this.http.get('http://localhost:5000/api/get-exams', { headers }).subscribe({
      next: (response: any) => {
        this.exams = response.filter((exam: any) => exam.submission?.status === 'completed');
      },
      error: (err) => {
        this.errorMessage = `Failed to load exams: ${err.error?.message || 'Unknown error'}`;
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  submitQuery(): void {
    const headers = this.authService.getAuthHeaders();
    const user = this.authService.getCurrentUser();
    const queryData = {
      exam_id: this.query.examId,
      student_id: user.student_id,
      query_text: this.query.queryText,
      submitted_at: new Date().toISOString()
    };
    this.http.post('http://localhost:5000/api/raise-query', queryData, { headers }).subscribe({
      next: () => {
        this.successMessage = 'Query submitted successfully';
        this.query = { examId: '', queryText: '' };
      },
      error: (err) => {
        this.errorMessage = `Failed to submit query: ${err.error?.message || 'Unknown error'}`;
      }
    });
  }
} 