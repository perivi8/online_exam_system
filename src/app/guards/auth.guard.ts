import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/login']);
    }
    const user = this.authService.getCurrentUser();
    const currentRoute = window.location.pathname;

    if (user) {
      if (currentRoute.includes('student-dashboard') && user.role !== 'student') {
        return this.router.createUrlTree(['/login']);
      }
      if (currentRoute.includes('teacher-dashboard') && user.role !== 'teacher') {
        return this.router.createUrlTree(['/login']);
      }
      if (currentRoute.includes('examiner-dashboard') && user.role !== 'examiner') {
        return this.router.createUrlTree(['/login']);
      }
      if (currentRoute.includes('proctor-dashboard') && user.role !== 'proctor') {
        return this.router.createUrlTree(['/login']);
      }
      if (currentRoute.includes('create-exam') && !['teacher', 'examiner'].includes(user.role)) {
        return this.router.createUrlTree(['/login']);
      }
      if (currentRoute.includes('evaluate-exam') && !['teacher', 'examiner'].includes(user.role)) {
        return this.router.createUrlTree(['/login']);
      }
    }
    return true;
  }
} 