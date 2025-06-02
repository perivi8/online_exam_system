import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-performance-report',
  templateUrl: './performance-report.component.html',
  styleUrls: ['./performance-report.component.scss']
})
export class PerformanceReportComponent implements OnInit {
  exams: any[] = [];
  reportData: any[] = [];
  selectedExamId: string = '';
  selectedExam: any = null;
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const headers = this.authService.getAuthHeaders();
    this.http.get('http://localhost:5000/api/get-exams', { headers }).subscribe({
      next: (response: any) => {
        this.exams = response;
      },
      error: (err) => {
        this.errorMessage = `Failed to load exams: ${err.error?.message || 'Unknown error'}`;
      }
    });
  }

  loadReport(): void {
    if (!this.selectedExamId) return;
    this.selectedExam = this.exams.find(exam => exam.exam_id === this.selectedExamId);
    const headers = this.authService.getAuthHeaders();
    this.http.get(`http://localhost:5000/api/get-submissions/${this.selectedExamId}`, { headers }).subscribe({
      next: (response: any) => {
        this.reportData = response;
      },
      error: (err) => {
        this.errorMessage = `Failed to load report: ${err.error?.message || 'Unknown error'}`;
        this.reportData = [];
      }
    });
  }
}