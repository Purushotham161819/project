import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-recipients',
  standalone: false,

  templateUrl: './recipients.component.html',
  styleUrl: './recipients.component.css',
})
export class RecipientsComponent {
  showForm = false; // Controls visibility of the form
  formData = {
    firstName: '',
    lastName: '',
    email: '',
  }; // Data binding for the form fields

  constructor(private http: HttpClient) {}

  // Toggles the display of the form
  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  // Submits the form and sends data to the server
  submitForm(): void {
    // Validate input data
    if (
      !this.formData.firstName.trim() ||
      !this.formData.lastName.trim() ||
      !this.validateEmail(this.formData.email)
    ) {
      alert('Please fill in all fields with valid data.');
      return;
    }

    // Fetch the token from local storage
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You are not authenticated. Please log in.');
      return;
    }

    // Include the token in the Authorization header
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Send a POST request to the server
    this.http.post('http://localhost:3000/addRecipient', this.formData, { headers }).subscribe(
      (response: any) => {
        alert(response.message || 'Recipient added successfully!');
        this.resetForm(); // Clear the form
        this.showForm = false; // Hide the form
        // Optionally, refresh recipient list here
      },
      (error) => {
        console.error('Error adding recipient:', error);

        if (error.status === 401 || error.status === 403) {
          alert('You are not authorized. Please log in again.');
        } else {
          alert('Failed to add recipient. Please try again.');
        }
      }
    );
  }

  // Validates email format
  validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  // Resets the form data
  resetForm(): void {
    this.formData = {
      firstName: '',
      lastName: '',
      email: '',
    };
  }
}
