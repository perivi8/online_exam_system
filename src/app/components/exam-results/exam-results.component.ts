import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-exam-results',
  templateUrl: './exam-results.component.html',
  styleUrls: ['./exam-results.component.scss']
})
export class ExamResultsComponent implements OnInit {
  results: any[] = [];
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private examService: ExamService
  ) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    this.examService.getResults().subscribe({
      next: (response: any) => {
        this.results = response.filter((exam: any) => exam.submission?.status === 'completed');
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = `Failed to load results: ${err.error?.message || 'Unknown error'}`;
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }
}