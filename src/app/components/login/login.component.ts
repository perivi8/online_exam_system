import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Please enter email and password.';
      return;
    }
    this.authService.login(this.loginData).subscribe({
      next: (response: { token: string; user: { email: string; role: string; name: string; student_id: string } }) => {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('user', JSON.stringify(response.user));
        switch (response.user.role) {
          case 'student':
            this.router.navigate(['/student-dashboard']);
            break;
          case 'teacher':
            this.router.navigate(['/teacher-dashboard']);
            break;
          case 'examiner':
            this.router.navigate(['/examiner-dashboard']);
            break;
          case 'proctor':
            this.router.navigate(['/proctor-dashboard']);
            break;
          default:
            this.errorMessage = 'Unknown role';
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed.';
      }
    });
  }
}