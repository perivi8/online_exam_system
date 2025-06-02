import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email = '';
  code = '';
  newPassword = '';
  step: 'email' | 'code' | 'password' = 'email';
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmitEmail(): void {
    if (!this.email) {
      this.errorMessage = 'Please enter your email.';
      return;
    }
    this.authService.forgotPassword(this.email).subscribe({
      next: (response: { message: string }) => {
        this.successMessage = response.message;
        this.errorMessage = '';
        this.step = 'code';
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Failed to send verification code.';
        this.successMessage = '';
      }
    });
  }

  onSubmitCode(): void {
    if (!this.code) {
      this.errorMessage = 'Please enter the verification code.';
      return;
    }
    this.authService.verifyCode(this.email, this.code).subscribe({
      next: (response: { message: string }) => {
        this.successMessage = response.message;
        this.errorMessage = '';
        this.step = 'password';
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Invalid verification code.';
        this.successMessage = '';
      }
    });
  }

  onSubmitPassword(): void {
    if (!this.newPassword) {
      this.errorMessage = 'Please enter a new password.';
      return;
    }
    this.authService.resetPassword(this.email, this.code, this.newPassword).subscribe({
      next: (response: { message: string }) => {
        this.successMessage = response.message;
        this.errorMessage = '';
        alert('Password reset successful! Please log in with your new password.');
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Failed to reset password.';
        this.successMessage = '';
      }
    });
  }
}