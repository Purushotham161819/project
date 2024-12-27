import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-authentication',
  standalone: false,

  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css',
})
export class AuthenticationComponent {
  formData = { username: '', password: '' };
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  login(): void {
    this.errorMessage = '';

    // Validate input
    if (!this.formData.username.trim() || !this.formData.password.trim()) {
      this.errorMessage = 'Both username and password are required.';
      return;
    }

    // Send login request to the backend
    this.http.post('/api/login', this.formData).subscribe(
      (response: any) => {
        // Save token and login flag
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('isLoggedIn', 'true');

        // Redirect to dashboard
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.errorMessage =
          error.error?.message || 'Login failed. Please try again.';
      }
    );
  }
}