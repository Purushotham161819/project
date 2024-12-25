import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { RecipientsComponent } from './recipients/recipients.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: 'recipients', component: RecipientsComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Redirect to Dashboard by default
  { path: '**', redirectTo: '/dashboard' }, // Wildcard route for 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
