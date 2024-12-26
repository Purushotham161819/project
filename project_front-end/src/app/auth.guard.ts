import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Check if the application is running in a browser environment
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        return true; // User is authenticated
      }
    }

    // Redirect to login if not authenticated
    this.router.navigate(['/login']);
    return false;
  }
}
