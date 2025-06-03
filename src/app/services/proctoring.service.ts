import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProctoringService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  startProctoring(studentId: string, examId: string): Observable<any> {
    return this.http.post('http://localhost:5000/api/start-proctoring', { student_id: studentId, exam_id: examId }, { headers: this.authService.getAuthHeaders() });
  }

  logMalpractice(studentId: string, event: string): Observable<any> {
    return this.http.post('http://localhost:5000/api/log-malpractice', { student_id: studentId, event }, { headers: this.authService.getAuthHeaders() });
  }

  stopExam(examId: string, studentId: string): Observable<any> {
    return this.http.post(`http://localhost:5000/api/stop-exam/${examId}/${studentId}`, {}, { headers: this.authService.getAuthHeaders() });
  }
}