import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss']
})
export class TeacherDashboardComponent implements OnInit {
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

  createExam(): void {
    this.router.navigate(['/create-exam']);
  }

  editExam(examId: string): void {
    this.router.navigate(['/edit-exam', examId]);
  }

  deleteExam(examId: string): void {
    if (confirm('Are you sure you want to delete this exam?')) {
      const headers = this.authService.getAuthHeaders();
      this.http.delete(`http://localhost:5000/api/delete-exam/${examId}`, { headers }).subscribe({
        next: () => {
          this.exams = this.exams.filter(exam => exam.exam_id !== examId);
        },
        error: (err) => {
          this.errorMessage = `Failed to delete exam: ${err.error?.message || 'Unknown error'}`;
        }
      });
    }
  }

  evaluateExams(): void {
    this.router.navigate(['/evaluate-exam']);
  }

  formatDuration(seconds: number): string {
    return this.utilityService.formatDuration(seconds);
  }
} 