import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: { email: string; role: string; name: string; student_id: string } | null = null;
  showLogout = false;
  private userSubscription: Subscription;

  constructor(private router: Router, private authService: AuthService) {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  toggleLogout(): void {
    this.showLogout = !this.showLogout;
  }

  logout(): void {
    this.authService.logout();
    this.showLogout = false;
    this.router.navigate(['/login']);
  }
}