import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerData = { name: '', email: '', password: '', confirmPassword: '', role: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    const email = this.registerData.email;
    const role = this.registerData.role;

    if (role === 'student' && !email.includes('@gmail.com')) {
      this.errorMessage = 'Students must use a Gmail address.';
      return;
    } else if (role === 'teacher' && email !== 'teacher@gmail.com') {
      this.errorMessage = 'Teacher must use teacher@gmail.com.';
      return;
    } else if (role === 'examiner' && email !== 'examiner@gmail.com') {
      this.errorMessage = 'Examiner must use examiner@gmail.com.';
      return;
    } else if (role === 'proctor' && email !== 'proctor@gmail.com') {
      this.errorMessage = 'Proctor must use proctor@gmail.com.';
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.authService.register(this.registerData).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => this.errorMessage = err.error?.message || 'Registration failed.'
    });
  }
} 