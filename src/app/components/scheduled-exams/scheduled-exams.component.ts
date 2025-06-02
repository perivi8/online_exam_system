import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-scheduled-exams',
  templateUrl: './scheduled-exams.component.html',
  styleUrls: ['./scheduled-exams.component.scss']
})
export class ScheduledExamsComponent implements OnInit {
  exams: any[] = [];
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    const headers = this.authService.getAuthHeaders();
    this.http.get('http://localhost:5000/api/get-exams', { headers }).subscribe({
      next: (response: any) => {
        this.exams = response.filter((exam: any) => exam.status === 'scheduled');
        this.errorMessage = '';
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

  formatDuration(seconds: number): string {
    return this.utilityService.formatDuration(seconds);
  }

  isExamNotAvailable(scheduledFor: string): boolean {
    return this.utilityService.isExamNotAvailable(scheduledFor);
  }
} 