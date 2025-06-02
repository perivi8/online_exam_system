import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-exam',
  templateUrl: './edit-exam.component.html',
  styleUrls: ['./edit-exam.component.scss'] // Changed from .css to .scss
})
export class EditExamComponent implements OnInit {
  examData: any = null;
  exam_id: string = '';
  useCsv: boolean = false;
  csvFile: File | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.exam_id = id;
      this.loadExam(this.exam_id);
    } else {
      this.errorMessage = 'Invalid exam ID';
      this.loading = false;
    }
  }

  loadExam(examId: string): void {
    const headers = this.authService.getAuthHeaders();
    this.http.get(`http://localhost:5000/api/get-exams/${examId}`, { headers }).subscribe({
      next: (response: any) => {
        this.examData = {
          title: response.title,
          duration: response.duration,
          scheduled_for: new Date(response.scheduled_for).toISOString().slice(0, 16),
          difficulty: response.difficulty,
          randomized: response.randomized,
          questions: response.questions.map((q: any) => ({
            question: q.question,
            type: q.type,
            options: q.options || ['', '', '', ''],
            correct_option: q.correct_option || 0,
            difficulty: q.difficulty
          }))
        };
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = `Failed to load exam: ${err.error?.message || 'Unknown error'}`;
        this.loading = false;
      }
    });
  }

  addQuestion(): void {
    this.examData.questions.push({
      question: '',
      type: 'mcq',
      options: ['', '', '', ''],
      correct_option: 0,
      difficulty: 'easy'
    });
  }

  removeQuestion(index: number): void {
    this.examData.questions.splice(index, 1);
  }

  onQuestionTypeChange(index: number): void {
    const question = this.examData.questions[index];
    if (question.type === 'mcq') {
      question.options = ['', '', '', ''];
      question.correct_option = 0;
    } else {
      delete question.options;
      delete question.correct_option;
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.csvFile = input.files[0];
      this.useCsv = true;
    } else {
      this.csvFile = null;
      this.useCsv = false;
    }
  }

  submitExam(): void {
    const formData = new FormData();
    formData.append('title', this.examData.title);
    formData.append('duration', this.examData.duration.toString());
    formData.append('scheduled_for', this.examData.scheduled_for);
    formData.append('difficulty', this.examData.difficulty);
    formData.append('randomized', this.examData.randomized.toString());

    if (this.useCsv && this.csvFile) {
      formData.append('csv_file', this.csvFile);
    } else {
      this.examData.questions.forEach((q: any) => {
        formData.append('questions[]', JSON.stringify(q));
      });
    }

    const headers = this.authService.getAuthHeaders();
    this.http.patch(`http://localhost:5000/api/edit-exam/${this.exam_id}`, formData, { headers }).subscribe({
      next: () => {
        this.successMessage = 'Exam updated successfully!';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/teacher-dashboard']), 2000);
      },
      error: (err: any) => {
        this.errorMessage = `Failed to update exam: ${err.error?.message || 'Unknown error'}`;
        this.successMessage = '';
      }
    });
  }
}