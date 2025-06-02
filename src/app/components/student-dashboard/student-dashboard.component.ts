import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {
  scheduledExams: any[] = [];
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.loadScheduledExams();
  }

  loadScheduledExams(): void {
    const headers = this.authService.getAuthHeaders();
    this.http.get('http://localhost:5000/api/get-exams', { headers }).subscribe({
      next: (response: any) => {
        this.scheduledExams = response.filter((exam: any) => exam.status === 'scheduled');
      },
      error: (err) => {
        this.errorMessage = `Failed to load exams: ${err.error?.message || 'Unknown error'}`;
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  takeExam(examId: string): void {
    this.router.navigate(['/take-exam', examId]);
  }

  viewResults(): void {
    this.router.navigate(['/exam-results']);
  }

  raiseQueries(): void {
    this.router.navigate(['/raise-queries']);
  }

  formatDuration(seconds: number): string {
    return this.utilityService.formatDuration(seconds);
  }

  isExamNotAvailable(scheduledFor: string): boolean {
    return this.utilityService.isExamNotAvailable(scheduledFor);
  }
} 