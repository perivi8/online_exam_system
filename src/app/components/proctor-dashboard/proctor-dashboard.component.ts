import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProctoringService } from '../../services/proctoring.service';

@Component({
  selector: 'app-proctor-dashboard',
  templateUrl: './proctor-dashboard.component.html',
  styleUrls: ['./proctor-dashboard.component.scss']
})
export class ProctorDashboardComponent implements OnInit {
  ongoingExams: any[] = [];
  malpracticeLogs: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private proctoringService: ProctoringService
  ) {}

  ngOnInit(): void {
    this.loadOngoingExams();
    this.loadMalpracticeLogs();
  }

  loadOngoingExams(): void {
    const headers = this.authService.getAuthHeaders();
    this.http.get('https://one-line-exam-2-3.onrender.com/api/get-exams', { headers }).subscribe({
      next: (exams: any) => {
        this.ongoingExams = [];
        exams.forEach((exam: any) => {
          if (exam.submission?.status === 'in_progress') {
            this.ongoingExams.push({
              exam_id: exam.exam_id,
              exam_title: exam.title,
              student_id: exam.submission.student_id,
              start_time: exam.submission.start_time
            });
          }
        });
      },
      error: (err) => {
        this.errorMessage = `Failed to load ongoing exams: ${err.error?.message || 'Unknown error'}`;
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  loadMalpracticeLogs(): void {
    const headers = this.authService.getAuthHeaders();
    this.http.get('https://one-line-exam-2-3.onrender.com/api/proctoring-logs', { headers }).subscribe({
      next: (logs: any) => {
        this.malpracticeLogs = logs;
      },
      error: (err) => {
        this.errorMessage = `Failed to load malpractice logs: ${err.error?.message || 'Unknown error'}`;
      }
    });
  }

  startProctoring(examId: string, studentId: string): void {
    this.proctoringService.startProctoring(studentId, examId).subscribe({
      next: (response) => {
        this.successMessage = `Proctoring started: ${response.message}`;
      },
      error: (err) => {
        this.errorMessage = `Failed to start proctoring: ${err.error?.message || 'Unknown error'}`;
      }
    });
  }

  stopExam(examId: string, studentId: string): void {
    if (confirm('Are you sure you want to stop this exam?')) {
      this.proctoringService.stopExam(examId, studentId).subscribe({
        next: () => {
          this.successMessage = 'Exam stopped successfully';
          this.loadOngoingExams();
        },
        error: (err) => {
          this.errorMessage = `Failed to stop exam: ${err.error?.message || 'Unknown error'}`;
        }
      });
    }
  }
}