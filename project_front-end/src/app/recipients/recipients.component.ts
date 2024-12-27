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

  recipients: Array<{ id: string; name: string; email: string }> = []; // Dynamic table data with ID

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRecipients();
  }

  // Fetch recipients from the server
  fetchRecipients(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You are not authenticated. Please log in.');
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get('/api/getRecipients', { headers }).subscribe(
      (response: any) => {
        this.recipients = response.map((recipient: any) => ({
          id: recipient.id, // Assuming ID is part of the response
          name: `${recipient.firstName} ${recipient.lastName}`,
          email: recipient.email,
        }));
      },
      (error) => {
        console.error('Error fetching recipients:', error);
        alert('Failed to retrieve recipients. Please try again.');
      }
    );
  }

  // Toggles the display of the form
  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  // Submits the form and sends data to the server
  submitForm(): void {
    if (
      !this.formData.firstName.trim() ||
      !this.formData.lastName.trim() ||
      !this.validateEmail(this.formData.email)
    ) {
      alert('Please fill in all fields with valid data.');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You are not authenticated. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.post('api/addRecipient', this.formData, { headers }).subscribe(
      (response: any) => {
        alert(response.message || 'Recipient added successfully!');
        this.resetForm();
        this.showForm = false;
        this.fetchRecipients(); // Refresh the recipients list dynamically
      },
      (error) => {
        console.error('Error adding recipient:', error);
        alert('Failed to add recipient. Please try again.');
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
