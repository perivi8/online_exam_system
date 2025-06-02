import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getExams(): Observable<any> {
    return this.http.get('https://one-line-exam-2-3.onrender.com/api/get-exams', { headers: this.authService.getAuthHeaders() });
  }

  getResults(): Observable<any> {
    const user = this.authService.getCurrentUser();
    return this.http.get(`https://one-line-exam-2-3.onrender.com/api/get-exams?email=${user.email}`, { headers: this.authService.getAuthHeaders() });
  }

  startExam(examId: string): Observable<any> {
    return this.http.post(`https://one-line-exam-2-3.onrender.com/api/start-exam/${examId}`, {}, { headers: this.authService.getAuthHeaders() });
  }

  submitExam(examId: string, answers: any[]): Observable<any> {
    const user = this.authService.getCurrentUser();
    return this.http.post('https://one-line-exam-2-3.onrender.com/api/submit-exam', {
      exam_id: examId,
      user_email: user.email,
      answers
    }, { headers: this.authService.getAuthHeaders() });
  }
}