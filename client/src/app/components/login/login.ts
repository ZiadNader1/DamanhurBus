import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, public lang: TranslationService) {
    // Auto redirect if already logged in!
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = this.lang.t('login_err_empty');
      return;
    }

    this.loading = true;
    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          this.loading = false;
          // In a real app, we check if user is admin
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 0) {
            this.errorMessage = this.lang.t('login_err_server');
          } else {
            this.errorMessage = this.lang.t('login_err_wrong');
          }
        }
      });
  }
}
