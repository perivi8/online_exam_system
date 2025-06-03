import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-exam',
  templateUrl: './create-exam.component.html',
  styleUrls: ['./create-exam.component.scss']
})
export class CreateExamComponent {
  exam = {
    title: '',
    duration: null as number | null,
    scheduled_for: '',
    difficulty: 'easy',
    randomized: false,
    questions: [] as any[]
  };
  scheduledForLocal: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  csvFile: File | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  addQuestion(): void {
    this.exam.questions.push({
      question: '',
      type: 'mcq',
      difficulty: 'easy',
      options: ['', '', '', ''],
      correct_option: 0
    });
  }

  removeQuestion(index: number): void {
    this.exam.questions.splice(index, 1);
  }

  onQuestionTypeChange(index: number): void {
    const question = this.exam.questions[index];
    if (question.type === 'mcq' && !question.options) {
      question.options = ['', '', '', ''];
      question.correct_option = 0;
    } else if (question.type === 'subjective') {
      delete question.options;
      delete question.correct_option;
    }
  }

  onFileChange(event: any): void {
    this.csvFile = event.target.files[0] || null;
  }

  onSubmit(): void {
    // Debug: Log token and form values
    const token = sessionStorage.getItem('token');
    console.log('Token:', token);
    if (!token) {
      this.errorMessage = 'No authentication token found. Please log in again.';
      this.router.navigate(['/login']);
      return;
    }

    console.log('Form Values:', {
      title: this.exam.title,
      duration: this.exam.duration,
      scheduledForLocal: this.scheduledForLocal,
      questions: this.exam.questions,
      csvFile: this.csvFile ? this.csvFile.name : null
    });

    // Validate inputs
    const title = this.exam.title?.trim();
    const duration = this.exam.duration != null ? Number(this.exam.duration) : null;
    const scheduledDate = this.scheduledForLocal ? new Date(this.scheduledForLocal) : null;

    if (!title) {
      this.errorMessage = 'Please enter a valid exam title.';
      return;
    }
    if (!duration || isNaN(duration) || duration <= 0) {
      this.errorMessage = 'Please enter a valid duration (positive number in minutes).';
      return;
    }
    if (!scheduledDate || isNaN(scheduledDate.getTime())) {
      this.errorMessage = 'Please select a valid scheduled date and time.';
      return;
    }
    if (!this.csvFile && this.exam.questions.length === 0) {
      this.errorMessage = 'Please provide questions via CSV or add at least one question manually.';
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('duration', duration.toString());
    formData.append('scheduled_for', scheduledDate.toISOString());
    formData.append('difficulty', this.exam.difficulty);
    formData.append('randomized', this.exam.randomized.toString());

    if (this.csvFile) {
      formData.append('csv_file', this.csvFile);
    }
    if (this.exam.questions.length > 0) {
      this.exam.questions.forEach((q, index) => {
        console.log(`Appending question ${index}:`, q);
        formData.append('questions[]', JSON.stringify(q));
      });
    }

    // Debug: Log FormData contents
    for (const pair of (formData as any).entries()) {
      console.log(`FormData: ${pair[0]} = ${pair[1]}`);
    }

    const headers = this.authService.getAuthHeaders();
    console.log('Request Headers:', headers);
    this.http.post('http://localhost:5000/api/create-exam', formData, { headers }).subscribe({
      next: (response: any) => {
        this.successMessage = response.message;
        this.errorMessage = '';
        console.log('Exam created successfully:', response);
        this.router.navigate(['/teacher-dashboard']);
      },
      error: (err) => {
        console.error('Create exam error:', err);
        if (err.status === 0) {
          this.errorMessage = 'Failed to connect to the server. Please check if the backend is running and CORS is configured correctly.';
        } else if (err.status === 401) {
          this.errorMessage = 'Session expired or invalid token. Please log in again.';
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = `Failed to create exam: ${err.error?.message || 'Unknown error'}`;
        }
      }
    });
  }
}